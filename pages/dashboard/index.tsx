import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PageLayout } from '../../src/components/Layout';
import { InfoModal } from '../../src/components/Modal';
import { ProjectList } from '../../src/components/project/ProjectList';
import { useAxios } from '../../src/hooks/use-axios';
import { Project } from '../../src/models/project';
import { setProjects } from '../../src/redux/project';
import { useAppDispatch, useAppSelector } from '../../src/redux/store';
import { ErrorData, formatAxiosError } from '../../src/utils/error.utils';
import { ApiResponse } from '../../src/utils/serve.utils';
import styles from '../../styles/Default.module.css';

type LoginInput = {
  username: string;
  password: string;
};

const Dashboard: NextPage = () => {
  const axios = useAxios();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [errorData, setErrorData] = useState<ErrorData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [filter, setFilters] = useState<Partial<Project>>({});
  //   const [projects, setProjects] = useState<Project[]>([]);
  const projects = useAppSelector((state) => state.project.projects);

  useEffect(() => {
    let mounted = true;

    setErrorData({});
    setLoading(true);

    const loadProjects = async () => {
      try {
        const response = await axios.post<ApiResponse>(
          '/projects/index',
          filter
        );

        const resData = response.data;

        console.log({ resData });

        if (!mounted) {
          return;
        }

        setMessage(resData?.message);

        if (resData?.successful) {
          //   setProjects(resData?.data);

          dispatch(setProjects({ projects: resData.data }));
        }
      } catch (error) {
        const errorInfo = formatAxiosError(error);
        setErrorData(errorInfo);
        setMessage(errorInfo.message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, [filter]);

  return (
    <PageLayout title='Login'>
      <div className='my-4'>
        <h1 className={styles.title}>Projects</h1>
      </div>

      <div className='my-4'>
        <Link href={'projects/create'}>Add New Project</Link>
      </div>

      <div>
        <ProjectList projects={projects} />
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </PageLayout>
  );
};

export default Dashboard;
