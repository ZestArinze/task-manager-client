import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAxios } from '../../hooks/use-axios';

import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { InfoModal } from '../Modal';

import { ErrorMessage } from '@hookform/error-message';
import Spinner from 'react-bootstrap/Spinner';
import { addProject } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ValidationErrors } from '../Error';

type CreateProjectInput = {
  title: string;
  description: string;
};

type Props = { onComplete: (successful: boolean) => any };

export const AddProject: React.FC<Props> = ({ onComplete }) => {
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
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. prefilled text',
    },
  });

  const formSubmitHandler = async (
    data: CreateProjectInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    setErrorData({});
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/projects', data);
      const resData = response.data;

      setMessage(resData?.message);

      if (resData?.successful) {
        dispatch(addProject(resData.data));
        reset();
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
      <h4>Add Project</h4>

      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div className='mb-3'>
          <label htmlFor='exampleInputUsername1' className='form-label'>
            Project Title
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
