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
import { staticAppRoutes } from '../src/constants/config';
import { ACCESS_TOKEN_KEY } from '../src/constants/storage';
import { useAxios } from '../src/hooks/use-axios';
import { ErrorData, formatAxiosError } from '../src/utils/error.utils';
import { ApiResponse } from '../src/utils/serve.utils';
import styles from '../styles/Default.module.css';

type LoginInput = {
  username: string;
  password: string;
};

const Home = () => {
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
      password: '',
    },
  });

  const formSubmitHandler = async (
    data: LoginInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    setErrorData({});
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/auth/login', data);
      const resData = response.data;

      setMessage(resData?.message);

      if (resData?.successful && resData?.data?.access_token) {
        // reset();
        localStorage.setItem(ACCESS_TOKEN_KEY, resData.data.access_token);
        router.push(staticAppRoutes.dashboard);
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
      <h1 className={styles.title}>Login</h1>

      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div className='mb-3'>
          <label htmlFor='exampleInputUsername1' className='form-label'>
            Username
          </label>
          <input
            type='text'
            className='form-control'
            id='exampleInputUsername1'
            aria-describedby='usernameHelp'
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

        {loading ? (
          <Spinner animation='border' variant='primary' />
        ) : (
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        )}
      </form>

      <div className='my-4'>
        {`Don't have an account? `}
        <Link href={'/signup'}>Sign up</Link>
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </PageLayout>
  );
};

export default Home;

Home.requireGuest = true;
