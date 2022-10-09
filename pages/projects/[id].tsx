import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageLayout } from '../../src/components/Layout';
import { ContainerModal, InfoModal } from '../../src/components/Modal';
import { useAxios } from '../../src/hooks/use-axios';
import { ErrorData, formatAxiosError } from '../../src/utils/error.utils';
import { ApiResponse } from '../../src/utils/serve.utils';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ProjectListItem } from '../../src/components/project/ProjectListItem';
import { AddTask } from '../../src/components/task/AddTask';
import { TaskList } from '../../src/components/task/TaskList';
import { Project } from '../../src/models/project';
import { addProject } from '../../src/redux/project';
import { useAppDispatch, useAppSelector } from '../../src/redux/store';
import { groupTasks } from '../../src/utils/task.utils';
import { staticAppRoutes } from '../../src/constants/config';

type EditProjectInput = {
  title: string;
  description: string;
};

const CreateProject: NextPage = () => {
  const axios = useAxios();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const projects = useAppSelector((state) => state.project.projects);

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [errorData, setErrorData] = useState<ErrorData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);
  const [addTask, setAddTask] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    const { id } = router.query;
    const projectId = id ? +id : 0;
    const project = projects.find((p) => p.id === projectId);

    if (project) {
      setProject(project);

      setValue('title', project.title);
      setValue('description', project.description);
    }
  }, [projects]);

  const formSubmitHandler = async (
    data: EditProjectInput,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    setErrorData({});
    setLoading(true);

    try {
      const response = await axios.patch<ApiResponse>(
        `/projects/${project?.id}`,
        data
      );
      const resData = response.data;

      if (resData?.successful) {
        dispatch(addProject(resData.data));

        setMessage(resData?.message ?? 'Edit successfull');

        setTimeout(() => {
          router.push(staticAppRoutes.dashboard);
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

  const onAddTask = async (successful: boolean) => {
    if (successful) {
      setTimeout(() => {
        setAddTask(false);
      }, 1200);
    }
  };

  return (
    <PageLayout title='Login'>
      <div>
        <div className='my-4'>
          &#8592; <Link href={'/dashboard'}>Dashboard</Link>
        </div>

        {project && (
          <>
            <ProjectListItem project={project} showEditButton />

            {project.tasks ? (
              <>
                <div className='d-flex justify-content-between align-items-center p-2 mt-2'>
                  <h4>Todo</h4>

                  <FontAwesomeIcon
                    icon={faPlus}
                    className='btn btn-primary text-white badge pill mx-1'
                    size='1x'
                    onClick={() => setAddTask(true)}
                  />
                </div>
                <TaskList tasks={groupTasks(project.tasks).pending} />
              </>
            ) : (
              []
            )}

            {project.tasks ? (
              <>
                <div className='d-flex justify-content-between align-items-center p-2 mt-2'>
                  <h4>Done</h4>
                </div>
                <TaskList tasks={groupTasks(project.tasks).completed} />
              </>
            ) : (
              []
            )}
          </>
        )}
      </div>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />

      {addTask && project && (
        <ContainerModal show={addTask} handleClose={() => setAddTask(false)}>
          <AddTask onComplete={onAddTask} projectId={project.id} />
        </ContainerModal>
      )}
    </PageLayout>
  );
};

export default CreateProject;
