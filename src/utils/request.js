import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10010001) {
        // // to re-login
        MessageBox.alert('会话超时请退出重新登录', '确认退出', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code === 401) {
        Notification({
          message: res.message,
          type: 'warning',
          duration: 5 * 1000
        })
      } else if (res.code === 429) {
        Notification({
          message: '操作太频繁，请稍后重试',
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        Notification({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      // return Promise.reject(new Error(res.message))
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Notification({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error.response.data.message)
  }
)

export default service
