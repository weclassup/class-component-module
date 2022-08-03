import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import keys from "../json/key.name.json";
import { loadingEventEmitter } from "../events/class.event";

export interface ClassRequestConfig extends AxiosRequestConfig {
  disableLoader?: boolean;
  showErrorAlert?: boolean;
}

const baseURL =
  import.meta.env.VITE_ENV === "production"
    ? "https://api.weclass.com.tw/"
    : "https://sit-api.weclass.com.tw/";

const teacherClassAPI = axios.create({ baseURL });
const studentClassAPI = axios.create({ baseURL });
const classAPI = axios.create({ baseURL });

const teacherClassRequestHandler = (
  config: ClassRequestConfig
): ClassRequestConfig | Promise<ClassRequestConfig> => {
  if (!config.disableLoader) {
    loadingEventEmitter.emit(true);
  }

  const token = window.localStorage.getItem(keys.TEACHER_ACCESS_TOKEN);
  if (token) {
    config.headers["X-PC-TEACHER-TOKEN"] = token;
  }
  return config;
};

const studentClassRequestHandler = (
  config: ClassRequestConfig
): ClassRequestConfig | Promise<ClassRequestConfig> => {
  if (!config.disableLoader) {
    loadingEventEmitter.emit(true);
  }

  const token = window.localStorage.getItem(keys.STUDENT_ACCESS_TOKEN);
  if (token) {
    config.headers["X-PC-STUDENT-TOKEN"] = token;
  }
  return config;
};

const classRequestHandler = (
  config: ClassRequestConfig
): ClassRequestConfig | Promise<ClassRequestConfig> => {
  if (!config.disableLoader) {
    loadingEventEmitter.emit(true);
  }

  return config;
};

const classResponseHandler = async (response: AxiosResponse) => {
  if (!response.config.disableLoader) {
    loadingEventEmitter.emit(false);
  }
  return response;
};

const classResponseErrorHandler = (error: any) => {
  if (!error.response.config?.disableLoader) {
    loadingEventEmitter.emit(false);
  }
  if (error.response.config?.showErrorAlert) {
    const errorResponse = error?.response?.data;
    const errorCode = errorResponse?.code;
    const errorName = errorResponse?.name;
    const errorMessages = errorResponse?.messages;
    alert(`${errorCode}: ${errorName}\n${JSON.stringify(errorMessages)}`);
  }

  return Promise.reject(error);
};

teacherClassAPI.interceptors.request.use(teacherClassRequestHandler);
teacherClassAPI.interceptors.response.use(
  classResponseHandler,
  classResponseErrorHandler
);

studentClassAPI.interceptors.request.use(studentClassRequestHandler);
studentClassAPI.interceptors.response.use(
  classResponseHandler,
  classResponseErrorHandler
);

classAPI.interceptors.request.use(classRequestHandler);
classAPI.interceptors.response.use(
  classResponseHandler,
  classResponseErrorHandler
);

export { teacherClassAPI, studentClassAPI, classAPI };
