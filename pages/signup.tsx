import { ErrorMessage } from '@hookform/error-message';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from 'react-hook-form';
import { ValidationErrors } from '../src/components/Error';
import { PageLayout } from '../src/components/Layout';
import { InfoModal } from '../src/components/Modal';
import { ACCESS_TOKEN_KEY } from '../src/constants/storage';
import { useAxios } from '../src/hooks/use-axios';
import { ErrorData, formatAxiosError } from '../src/utils/error.utils';
import { ApiResponse } from '../src/utils/serve.utils';
import styles from '../styles/Default.module.css';

type LoginInput = {
  username: string;
  password: string;
};

const SignUp: NextPage = () => {
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
      username: '',
      password: 'zeST83@_&nse',
      password_confirmation: 'zeST83@_&nse',
      first_name: 'John',
      last_name: 'Doe',
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
      const response = await axios.post<ApiResponse>('/auth/signup', data);
      const resData = response.data;

      console.log({ resData });

      setMessage(resData?.message);

      if (resData?.successful) {
        // reset();
        router.push('/');
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
    <PageLayout title='Login' isGuestRoute>
      <div className='my-4'>
        <h1 className={styles.title}>Sign up</h1>
      </div>

      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div className='mb-3'>
          <label htmlFor='exampleInputUsername1' className='form-label'>
            Username
          </label>
          <input
            type='text'
            className='form-control'
            id='exampleInputUsername1'
            {...register('username', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          <ErrorMessage errors={errors} name='username' />
          <ValidationErrors errors={errorData?.error?.username} />
        </div>
        <div className='mb-3'>
          <label htmlFor='exampleInputPassword1' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='exampleInputPassword1'
            {...register('password', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          <ErrorMessage errors={errors} name='password' />
          <ValidationErrors errors={errorData?.error?.password} />
        </div>

        <div className='mb-3'>
          <label htmlFor='firstName' className='form-label'>
            First Name
          </label>
          <input
            type='text'
            className='form-control'
            id='firstName'
            {...register('first_name', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          <ErrorMessage errors={errors} name='first_name' />
          <ValidationErrors errors={errorData?.error?.first_name} />
        </div>

        <div className='mb-3'>
          <label htmlFor='lastName' className='form-label'>
            Last Name
          </label>
          <input
            type='text'
            className='form-control'
            id='lastName'
            {...register('last_name', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          <ErrorMessage errors={errors} name='last_name' />
          <ValidationErrors errors={errorData?.error?.last_name} />
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
        {`Already have an account? `}
        <Link href={'/'}>Login</Link>
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </PageLayout>
  );
};

export default SignUp;
