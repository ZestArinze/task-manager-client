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
import { InfoModal } from '../Modal';

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

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete<ApiResponse>(`/projects/${id}`);

      const resData = response.data;

      console.log({ resData });

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

  const handleEdit = (id: number) => {
    router.push(`/projects/edit/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/projects/${id}`);
  };

  return (
    <>
      <li className='list-group-item d-flex justify-content-between align-items-center bg-light p-3'>
        <div className='ms-2 me-auto'>
          <div className='fw-bold'>{project.title}</div>
          {project.description}
        </div>

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
            className='btn btn-primary text-white badge pill mx-1'
            size='1x'
            onClick={() => handleEdit(project.id)}
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
      </li>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </>
  );
};
