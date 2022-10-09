import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/config';
import { ACCESS_TOKEN_KEY } from '../constants/storage';

export function useAxios() {
  const IS_SERVER_SIDE = typeof window === 'undefined';

  const defaultOptions = {
    baseUrl: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (req: AxiosRequestConfig) => {
    if (!IS_SERVER_SIDE) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!accessToken) {
        //logout
      }

      let authorizationValue = `Bearer ${accessToken}`;
      req.headers = {
        ...req.headers,
        ...{ Authorization: authorizationValue },
      };

      return req;
    }
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        if (IS_SERVER_SIDE) {
          // logout
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
      }

      return error;
    }
  );

  return instance;
}
