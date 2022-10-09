import Link from 'next/link';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../../styles/Default.module.css';

import { ErrorMessage } from '@hookform/error-message';
import Spinner from 'react-bootstrap/Spinner';
import { useAxios } from '../../hooks/use-axios';
import { addTask } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { ValidationErrors } from '../Error';
import { InfoModal } from '../Modal';

type AddTaskInput = {
  title: string;
  description: string;
};

type Props = {
  projectId: number;
};

export const AddTask: React.FC<Props> = ({ projectId }) => {
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const formSubmitHandler = async (
    data: AddTaskInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    console.log({ data });

    setErrorData({});
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/tasks', {
        ...data,
        project_id: projectId,
      });
      const resData = response.data;

      console.log({ resData });

      setMessage(resData?.message);

      if (resData?.successful) {
        dispatch(addTask(resData.data));

        setTimeout(() => {
          reset();
        }, 1500);
      }
    } catch (error) {
      const errorInfo = formatAxiosError(error);
      setErrorData(errorInfo);
      setMessage(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
