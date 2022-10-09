import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/use-axios';
import { Task } from '../../models/task';
import { removeTask, updateTask } from '../../redux/project';
import { useAppDispatch } from '../../redux/store';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { ContainerModal, InfoModal } from '../Modal';
import { UpdateTask } from './UpdateTask';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

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

  const [showConfirmCompleted, setShowConfirmCompleted] =
    useState<boolean>(false);
  const [confirmCompleted, setConfirmCompleted] = useState<boolean>(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const onUpdateTask = async (successful: boolean) => {
    if (successful) {
      setTimeout(() => {
        setEditTask(false);
      }, 1200);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!confirmDelete) {
      return;
    }

    const handleDelete = async () => {
      try {
        const response = await axios.delete<ApiResponse>(`/tasks/${task.id}`);

        const resData = response.data;

        setMessage(resData?.message);

        if (resData?.successful) {
          dispatch(removeTask({ projectId: task.project_id, taskId: task.id }));
        }
      } catch (error) {
        const errorInfo = formatAxiosError(error);
        setErrorData(errorInfo);
        setMessage(errorInfo.message);
      } finally {
        setLoading(false);
        if (mounted) {
          setConfirmCompleted(false);
        }
      }
    };

    handleDelete();

    return () => {
      mounted = false;
    };
  }, [confirmDelete]);

  useEffect(() => {
    let mounted = true;

    if (!confirmCompleted) {
      return;
    }

    const makeCompleted = async () => {
      setErrorData({});
      setLoading(true);

      try {
        const payload: Task = {
          ...task,
          completed_at: new Date().toISOString(),
        };

        const response = await axios.patch<ApiResponse>(
          `/tasks/${task.id}`,
          payload
        );
        const resData = response.data;

        if (!mounted) {
          return;
        }

        setMessage(resData?.message);

        if (resData?.successful) {
          dispatch(updateTask(payload));
        }
      } catch (error) {
        const errorInfo = formatAxiosError(error);
        setErrorData(errorInfo);
        setMessage(errorInfo.message);
      } finally {
        setLoading(false);
        if (mounted) {
          setConfirmCompleted(false);
        }
      }
    };

    makeCompleted();

    return () => {
      mounted = false;
    };
  }, [confirmCompleted]);

  return (
    <>
      <OverlayTrigger
        placement={'bottom'}
        overlay={
          task.completed_at ? (
            <Tooltip id={`tooltip-bottom`}>
              <>
                <strong>Completed on </strong>
                <span>{new Date(task.completed_at).toLocaleString()}</span>
              </>
            </Tooltip>
          ) : (
            <></>
          )
        }
      >
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center'>
            <input
              className='form-check-input m-1 p-3'
              type='checkbox'
              value=''
              aria-label={task.title}
              checked={!!task.completed_at}
              onChange={() => setShowConfirmCompleted(true)}
              disabled={!!task.completed_at}
            />
            <div className='p-2'>
              <div>
                <span className='title-sm'>{task.title}</span>
                <br />
                {task.description}
              </div>

              <p className='mt-2 text-secondary'>
                <small>
                  Created at {new Date(task.created_at).toLocaleString()}
                </small>
              </p>
            </div>
          </div>

          {task.completed_at ? (
            []
          ) : (
            <div className='d-flex justify-content-between align-items-center'>
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
                onClick={() => setShowConfirmDelete(true)}
              />
            </div>
          )}
        </li>
      </OverlayTrigger>

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />

      <InfoModal
        show={showConfirmCompleted}
        message={'Are you sure you want to mark this item as completed?'}
        handleOk={() => setConfirmCompleted(true)}
        handleClose={() => setShowConfirmCompleted(false)}
      />

      <InfoModal
        show={showConfirmDelete}
        message={'Are you sure you want to delete this item?'}
        handleOk={() => setConfirmDelete(true)}
        handleClose={() => setShowConfirmDelete(false)}
      />

      {editTask && (
        <ContainerModal show={editTask} handleClose={() => setEditTask(false)}>
          <UpdateTask task={task} onComplete={onUpdateTask} />
        </ContainerModal>
      )}
    </>
  );
};
