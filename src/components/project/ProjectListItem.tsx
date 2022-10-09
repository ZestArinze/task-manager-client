import React from 'react';
import { Project as ProjectObject } from '../../models/project';

type Props = {
  project: ProjectObject;
};

export const ProjectListItem: React.FC<Props> = ({ project }) => {
  return (
    <li className='list-group-item d-flex justify-content-between align-items-start'>
      <div className='ms-2 me-auto'>
        <div className='fw-bold'>{project.title}</div>
        {project.description}
      </div>
      <span className='badge bg-primary rounded-pill'>
        {project.tasks.length}
      </span>
    </li>
  );
};
