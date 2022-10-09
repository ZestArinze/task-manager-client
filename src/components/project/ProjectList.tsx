import React, { useState } from 'react';
import { useAxios } from '../../hooks/use-axios';
import { Project } from '../../models/project';
import { ErrorData, formatAxiosError } from '../../utils/error.utils';
import { ApiResponse } from '../../utils/serve.utils';
import { InfoModal } from '../Modal';
import { ProjectListItem } from './ProjectListItem';

type Props = {
  projects: Project[];
};

export const ProjectList: React.FC<Props> = ({ projects }) => {
  const axios = useAxios();

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
        // TODO remove from projects
      }
    } catch (error) {
      const errorInfo = formatAxiosError(error);
      setErrorData(errorInfo);
      setMessage(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {projects.map((project, i) => (
        <ol key={i} className='list-group'>
          <ProjectListItem project={project} handleDelete={handleDelete} />
        </ol>
      ))}

      <InfoModal
        show={!!message}
        message={message}
        handleClose={() => setMessage(null)}
      />
    </>
  );
};
