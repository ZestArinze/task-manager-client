import { AxiosError } from 'axios';

export type ErrorData = {
  message?: string | null;
  error?: any;
};

export const formatAxiosError = (
  error: AxiosError | any
): Record<string, any> => {
  let errorData: ErrorData = {
    message: error.message,
  };

  if (error.response) {
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);

    if (error.response.status == 422) {
      errorData = error.response.data;
    } else if (
      error.response.status &&
      error.response.status >= 200 &&
      error.response.status < 500
    ) {
      errorData.message = error.message;
      errorData.error = error.response.data;
    } else {
      errorData.message = 'Something went wrong';
    }
  } else if (error.request) {
    errorData.message = 'Something went wrong';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorData.message = 'Something went wrong';
  }

  return errorData;
};
