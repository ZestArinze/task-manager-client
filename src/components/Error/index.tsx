import React from 'react';

type Props = {
  errors?: Array<string>;
};

export const ValidationErrors: React.FC<Props> = ({ errors }) => {
  if (!errors || errors.length === 0) {
    return <></>;
  }

  return (
    <>
      {errors.map((err, i) => (
        <p key={i} className='text-danger'>
          {err}
        </p>
      ))}
    </>
  );
};
