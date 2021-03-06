import Axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { Loading } from 'element-ui'
import { ElLoadingComponent } from 'element-ui/types/loading'

declare module 'axios' {
  export interface AxiosRequestConfig {
    __retryCount?: number;
  }
}

interface PenddingType {
  url?: string;
  method?: Method;
  params: unknown;
  data: unknown;
  cancel: Function;
}

// 取消重复请求
const pendding: Array<PenddingType> = []
const CancelToken = Axios.CancelToken

let elLoading: ElLoadingComponent

const reuqest = Axios.create({
  baseURL: '/api',
  responseType: 'json'
})

function removePending (config: AxiosRequestConfig): void {
  for (const key in pendding) {
    const item: number = +key
    const list: PenddingType = pendding[key]
    if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel('操作太频繁，请稍后再试')
      pendding.splice(item, 1)
    }
  }
}

function reqSuccess (config: AxiosRequestConfig): AxiosRequestConfig {
  elLoading = Loading.service({
    text: '加载中',
    background: 'rgba(0, 0, 0, .3)'
  })
  removePending(config)
  config.cancelToken = new CancelToken((c) => {
    pendding.push({
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      cancel: c
    })
  })
  return config
}

function reqError (config: AxiosError): Promise<AxiosError> {
  elLoading.close()
  return Promise.reject(config)
}

function resSuccess (response: AxiosResponse): AxiosResponse {
  elLoading.close()
  removePending(response.config)
  return response
}

function resError (error: AxiosError): AxiosPromise<unknown> {
  elLoading.close()
  const response = error.response
  switch (response?.status) {
    case 401: {
      console.log('需要登录')
      break
    }
    case 403: {
      console.log('没有权限')
      break
    }
    case 500: {
      console.log('服务器错误')
      break
    }
    case 502: {
      console.log('请求超时')
      break
    }
    default: break
  }
  // 超时重新请求
  const config = error.config
  // 全局请求的次数和间隔时间
  const [RETRY_COUNT, RETRY_DELAY] = [3, 1000]
  if (config && RETRY_COUNT) {
    // 设置用于跟踪重试计数的变量
    config.__retryCount = config.__retryCount || 0
    if (config.__retryCount > RETRY_COUNT) {
      return Promise.reject(response || { message: error.message })
    }
    config.__retryCount++
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const backoff = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, RETRY_DELAY || 1)
    })
    return backoff.then(() => {
      return reuqest(config)
    })
  }
  return Promise.reject(error)
}

reuqest.interceptors.request.use(reqSuccess, reqError)
reuqest.interceptors.response.use(resSuccess, resError)

export default reuqest
