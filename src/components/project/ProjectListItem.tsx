import { faEdit, faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAxios } from '../../hooks/use-axios';
import { Project as ProjectObject } from '../../models/project';
import { removeProject } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { ContainerModal, InfoModal } from '../Modal';
import { UpdateProject } from './UpdateProject';

type Props = {
  project: ProjectObject;
  showEditButton?: boolean;
  showViewButton?: boolean;
};

export const ProjectListItem: React.FC<Props> = ({
  project,
  showEditButton,
  showViewButton,
}) => {
  const axios = useAxios();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [errorData, setErrorData] = useState<ErrorData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [updateProject, setUpdateProject] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete<ApiResponse>(`/projects/${id}`);

      const resData = response.data;

      setMessage(resData?.message);

      if (resData?.successful) {
        dispatch(removeProject(id));
      }
    } catch (error) {
      const errorInfo = formatAxiosError(error);
      setErrorData(errorInfo);
      setMessage(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    router.push(`/projects/${id}`);
  };

  const onUpdateProject = async (successful: boolean) => {
    if (successful) {
      setTimeout(() => {
        setUpdateProject(false);
      }, 1200);
    }
  };

  return (
    <>
      <li className='list-group-item d-flex justify-content-between align-items-center bg-light p-3'>
        <div className='ms-2 me-auto flex-grow-3'>
          <div className='fw-bold'>{project.title}</div>
          {project.description}
        </div>

        <div className='d-flex justify-content-end align-items-center'>
          <span className='badge bg-primary rounded-pill mx-1'>
            {project.tasks?.length ?? 0}
          </span>

          {showViewButton && (
            <FontAwesomeIcon
              icon={faInfo}
              className='badge rounded-pill mx-4 btn btn-info text-white'
              size='1x'
              onClick={() => handleView(project.id)}
            />
          )}

          {showEditButton && (
            <FontAwesomeIcon
              icon={faEdit}
              className='btn btn-primary text-white badge pill'
              size='1x'
              onClick={() => setUpdateProject(true)}
            />
          )}

          {project.tasks && project.tasks.length === 0 && (
            <FontAwesomeIcon
              icon={faTrash}
              className='badge pill mx-4 btn btn-danger text-white'
              size='1x'
              onClick={() => handleDelete(project.id)}
            />
          )}
        </div>
      </li>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />

      {updateProject && (
        <ContainerModal
          show={updateProject}
          handleClose={() => setUpdateProject(false)}
        >
          <UpdateProject onComplete={onUpdateProject} projectId={project.id} />
        </ContainerModal>
      )}
    </>
  );
};
