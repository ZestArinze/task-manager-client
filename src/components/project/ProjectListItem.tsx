import React from 'react';
import { Project as ProjectObject } from '../../models/project';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

type Props = {
  project: ProjectObject;
  handleDelete: (id: number) => any;
};

export const ProjectListItem: React.FC<Props> = ({ project, handleDelete }) => {
  return (
    <li className='list-group-item d-flex justify-content-between align-items-start'>
      <div className='ms-2 me-auto'>
        <div className='fw-bold'>{project.title}</div>
        {project.description}
      </div>

      <span className='badge bg-primary rounded-pill mx-1'>
        {project.tasks.length}
      </span>

      <FontAwesomeIcon
        icon={faTrash}
        className='text-danger badge rounded-pill mx-1'
        size='1x'
        onClick={() => handleDelete(project.id)}
      />
    </li>
  );
};
