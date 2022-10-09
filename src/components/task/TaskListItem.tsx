import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useAxios } from '../../hooks/use-axios';
import { Task } from '../../models/task';
import { removeTask } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { ContainerModal, InfoModal } from '../Modal';
import { UpdateTask } from './UpdateTask';

type Props = {
  task: Task;
};

export const TaskListItem: React.FC<Props> = ({ task }) => {
  const axios = useAxios();
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [errorData, setErrorData] = useState<ErrorData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [editTask, setEditTask] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete<ApiResponse>(`/tasks/${id}`);

      const resData = response.data;

      console.log({ resData });

      setMessage(resData?.message);

      if (resData?.successful) {
        dispatch(removeTask({ projectId: task.project_id, taskId: id }));
      }
    } catch (error) {
      const errorInfo = formatAxiosError(error);
      setErrorData(errorInfo);
      setMessage(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const onRemoveTask = async (successful: boolean) => {
    if (successful) {
      setTimeout(() => {
        setEditTask(false);
      }, 1200);
    }
  };

  return (
    <>
      <li className='list-group-item d-flex justify-content-between align-items-start bg-light p-3'>
        <div>
          <input
            className='form-check-input me-1'
            type='checkbox'
            value=''
            aria-label='...'
          />
          {task.title}
        </div>

        <div>
          <FontAwesomeIcon
            icon={faEdit}
            className='btn btn-primary text-white badge pill mx-1'
            size='1x'
            onClick={() => setEditTask(true)}
          />

          <FontAwesomeIcon
            icon={faTrash}
            className='badge pill mx-4 btn btn-danger text-white'
            size='1x'
            onClick={() => handleDelete(task.id)}
          />
        </div>
      </li>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />

      {editTask && (
        <ContainerModal show={editTask} handleClose={() => setEditTask(false)}>
          <UpdateTask task={task} onComplete={onRemoveTask} />
        </ContainerModal>
      )}
    </>
  );
};
