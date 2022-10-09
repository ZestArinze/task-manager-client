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

type LoginInput = {
  username: string;
  password: string;
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
      const response = await axios.post<ApiResponse>('/projects/index', data);
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
