import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ErrorMessage } from '@hookform/error-message';
import Spinner from 'react-bootstrap/Spinner';
import { useAxios } from '../../hooks/use-axios';
import { Task } from '../../models/task';
import { updateTask } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { ValidationErrors } from '../Error';
import { InfoModal } from '../Modal';

type UpdateTaskInput = {
  title: string;
  description: string;
};

type Props = {
  task: Task;
  onComplete: (successful: boolean) => any;
};

export const UpdateTask: React.FC<Props> = ({ task, onComplete }) => {
  const axios = useAxios();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [errorData, setErrorData] = useState<ErrorData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    setValue('title', task.title);
    setValue('description', task.description);
  }, []);

  const formSubmitHandler = async (
    data: UpdateTaskInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    setErrorData({});
    setLoading(true);

    try {
      const payload: Task = {
        ...task,
        ...data,
        project_id: task.project_id,
      };

      const response = await axios.patch<ApiResponse>(
        `/tasks/${task.id}`,
        payload
      );
      const resData = response.data;

      setMessage(resData?.message);

      if (resData?.successful) {
        dispatch(updateTask(payload));

        setTimeout(() => {
          reset();
        }, 1500);
      }

      onComplete(resData.successful);
    } catch (error) {
      const errorInfo = formatAxiosError(error);
      setErrorData(errorInfo);
      setMessage(errorInfo.message);

      onComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4>Update Task</h4>

      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div className='mb-3'>
          <label htmlFor='exampleInputUsername1' className='form-label'>
            Task Title
          </label>
          <input
            type='text'
            className='form-control'
            id='exampleInputUsername1'
            aria-describedby='usernameHelp'
            {...register('title', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          <ErrorMessage errors={errors} name='title' />
          <ValidationErrors errors={errorData?.error?.title} />
        </div>

        <div className='mb-3'>
          <label htmlFor='exampleFormControlTextarea1' className='form-label'>
            Description
          </label>
          <textarea
            className='form-control'
            id='exampleFormControlTextarea1'
            rows={3}
            {...register('description', {
              required: { value: true, message: 'This field is required' },
            })}
          ></textarea>

          <ErrorMessage errors={errors} name='description' />
          <ValidationErrors errors={errorData?.error?.description} />
        </div>

        {loading ? (
          <Spinner animation='border' variant='primary' />
        ) : (
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        )}
      </form>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </>
  );
};
