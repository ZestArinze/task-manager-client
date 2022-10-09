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
    // Something happened in setting up the request that triggered an Error
    errorData.message = 'Something went wrong';
  }

  return errorData;
};

export const getValidationErrors = (
  field: string,
  errorData?: Record<string, any>
): Array<string> | null => {
  if (!errorData) {
    return null;
  }

  let message: Array<string> = [];

  if (errorData[field]) {
    if (Array.isArray(errorData[field])) {
      return errorData[field];
    } else {
      message = [errorData[field]];
    }
  }

  return message;
};
