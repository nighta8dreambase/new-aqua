import useAxios, { Options } from "axios-hooks";
import { API_PATH } from "../utils/const";
import axios, { AxiosRequestConfig } from "axios";

export const callAPI = (config: AxiosRequestConfig, options?: Options) => {
  return axios({
    ...{
      baseURL: API_PATH,
      method: "GET",
      ...config,
      headers: {
        "Content-Type": "application/json",
        "Project-Key": localStorage.getItem("projectKey"),
        Authorization: "Bearer " + localStorage.getItem("token"),
        ...(config?.headers || {}),
      },
      data: config.data || {},
    },
    ...{ ...options, useCache: false },
  });
};

export const useCallAPI = <T>(config: AxiosRequestConfig, options?: Options) =>
  useAxios<T>(
    {
      baseURL: API_PATH,
      method: "GET",
      ...config,
      headers: {
        "Content-Type": "application/json",
        "Project-Key": localStorage.getItem("projectKey"),
        Authorization: "Bearer " + localStorage.getItem("token"),
        ...(config?.headers || {}),
      },
      data: config.data || {},
    },
    { ...options, useCache: false }
  );
