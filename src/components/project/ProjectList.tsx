import React from 'react';
import { Project } from '../../models/project';
import { AddTask } from '../task/AddTask';
import { ProjectListItem } from './ProjectListItem';

type Props = {
  projects: Project[];
};

export const ProjectList: React.FC<Props> = ({ projects }) => {
  return (
    <>
      {projects.map((project, i) => (
        <ol key={i} className='list-group'>
          <ProjectListItem project={project} showViewButton />
        </ol>
      ))}
    </>
  );
};
