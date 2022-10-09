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
    const statusCode = error.response.data?.statusCode ?? error.response.status;
    const message = error.response.data?.message ?? error.response.message;
    const resError = error.response.data?.error ?? error.response.data;

    if (statusCode && statusCode >= 200 && statusCode < 500) {
      errorData.message = message;
      errorData.error = resError;
    } else {
      errorData.message = 'Something went wrong';
    }
  } else if (error.request) {
    errorData.message = 'Something went wrong';
  } else {
    errorData.message = 'Something went wrong';
  }

  console.log({ errorData });

  return errorData;
};
