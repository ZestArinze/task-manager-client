import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PageLayout } from '../../src/components/Layout';
import { ContainerModal, InfoModal } from '../../src/components/Modal';
import { AddProject } from '../../src/components/project/AddProject';
import { ProjectList } from '../../src/components/project/ProjectList';
import { useAxios } from '../../src/hooks/use-axios';
import { Project } from '../../src/models/project';
import { setProjects } from '../../src/redux/project';
import { useAppDispatch, useAppSelector } from '../../src/redux/store';
import { ErrorData, formatAxiosError } from '../../src/utils/error.utils';
import { ApiResponse } from '../../src/utils/serve.utils';
import styles from '../../styles/Default.module.css';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const projects = useAppSelector((state) => state.project.projects);
  const [addNewProject, setAddNewProject] = useState<boolean>(false);

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

  const onAddProject = async (successful: boolean) => {
    if (successful) {
      setTimeout(() => {
        setAddNewProject(false);
      }, 1200);
    }
  };

  return (
    <PageLayout title='Projects' showBottomNavigation>
      <div className='my-4'>
        <h1 className={styles.title}>Projects</h1>
      </div>

      <div className='my-4'>
        <FontAwesomeIcon
          icon={faPlus}
          className='btn btn-primary text-white badge pill mx-1'
          size='1x'
          onClick={() => setAddNewProject(true)}
        />
      </div>

      <div>
        <ProjectList projects={projects} />
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />

      {addNewProject && (
        <ContainerModal
          show={addNewProject}
          handleClose={() => setAddNewProject(false)}
        >
          <AddProject onComplete={onAddProject} />
        </ContainerModal>
      )}
    </PageLayout>
  );
};

export default Dashboard;
