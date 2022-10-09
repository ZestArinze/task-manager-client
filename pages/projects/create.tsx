import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageLayout } from '../../src/components/Layout';
import { InfoModal } from '../../src/components/Modal';
import { useAxios } from '../../src/hooks/use-axios';
import { ErrorData, formatAxiosError } from '../../src/utils/error.utils';
import { ApiResponse } from '../../src/utils/serve.utils';
import styles from '../../styles/Default.module.css';

import { ErrorMessage } from '@hookform/error-message';
import { ValidationErrors } from '../../src/components/Error';
import Spinner from 'react-bootstrap/Spinner';

type LoginInput = {
  title: string;
  description: string;
};

const CreateProject: NextPage = () => {
  const axios = useAxios();
  const router = useRouter();

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
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem beatae asperiores optio ipsum deleniti minus voluptatibus error repellat labore voluptate, esse soluta? Magnam at magni ipsum aperiam, aliquid tempore soluta.',
    },
  });

  const formSubmitHandler = async (
    data: LoginInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    console.log({ data });

    setErrorData({});
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/projects', data);
      const resData = response.data;

      console.log({ resData });

      setMessage(resData?.message);

      if (resData?.successful && resData?.data?.access_token) {
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
    <PageLayout title='Login'>
      <div className='my-4'>
        <h1 className={styles.title}>Add New Project</h1>
      </div>

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

      <div className='my-4'>
        <Link href={'/dashboard'}>Dashboard</Link>
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </PageLayout>
  );
};

export default CreateProject;
