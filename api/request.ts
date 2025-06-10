import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

type ToastFunc = {
  error: (msg: string) => void;
};

type NavigateFunc = (path: string) => void;

type InitConfig = {
  baseurl: string;
  headers?: Record<string, string>;
  timeout?: number;
  isAborted?: boolean;
};

class Request {
  private instance: AxiosInstance;
  private toast?: ToastFunc;
  private navigate?: NavigateFunc;
  private isRequestAborted = false;
  private abortTimer = 0;
  private requestMap = new Map<string, () => void>();

  constructor(config: InitConfig, toast?: ToastFunc, navigate?: NavigateFunc) {
    const { baseurl, headers, timeout = 20000 } = config;

    this.instance = axios.create({
      baseURL: baseurl,
      timeout,
      headers: {
        "Content-Type": "application/json",
        Lang: "zh",
        ...headers,
      },
      withCredentials: true,
    });

    this.toast = toast;
    this.navigate = navigate;

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        this.handleRequest(config);
  
        // ✅ 动态添加 Authorization 头
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
  
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        this.cancelRequest(res.config);
        const { code } = res.data || {};
  
        if (code === 40000) {
          this.toast?.error("登录失效");
          this.navigate?.("/");
        }
  
        return res;
      },
      (error: AxiosError) => {
        this.cancelRequest(error.config as AxiosRequestConfig);
  
        if (error.code === "ECONNABORTED") {
          this.toast?.error("连接中断，请重试！");
          return Promise.reject("连接中断");
        }
  
        if (error.code === "ERR_NETWORK") {
          this.toast?.error("网络异常");
        }
  
        const message = this.handleResponseError(error.response);
        if (message) this.toast?.error(message);
  
        return Promise.reject(message || error);
      }
    );
  }
  

  private handleRequest(config: InternalAxiosRequestConfig) {
    this.cancelRequest(config);
    this.addRequest(config);
  }

  private cancelRequest(config?: AxiosRequestConfig) {
    if (!config) return;
    const key = this.getRequestKey(config);
    const cancel = this.requestMap.get(key);
    if (cancel) {
      cancel();
      this.requestMap.delete(key);
    }
  }

  private addRequest(config: AxiosRequestConfig) {
    const key = this.getRequestKey(config);
    config.cancelToken = new axios.CancelToken((cancel) => {
      this.requestMap.set(key, cancel);
    });
  }

  private getRequestKey(config: AxiosRequestConfig) {
    const { url, method, params, data } = config;
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join(
      "&"
    );
  }

  private handleResponseError(res?: AxiosResponse) {
    if (!res) return "";
    switch (res.status) {
      case 400:
        return "请求错误";
      case 401:
        return "未授权";
      case 403:
        return "拒绝访问";
      case 404:
        return `请求地址出错: ${res.config?.url}`;
      case 500:
        return "服务器内部错误";
      default:
        return "请求失败，请稍后重试";
    }
  }

  private request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config).then((res) => res.data);
  }

  get<T>(url: string, params?: unknown) {
    return this.request<T>({ url, method: "get", params });
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: "post", data });
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: "put", data });
  }

  del<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: "delete", data });
  }

  patch<T>(url: string, data?: unknown) {
    return this.request<T>({ url, method: "patch", data });
  }
}

export default Request;
