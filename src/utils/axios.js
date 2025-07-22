import axios from 'axios'

// 配置axios默认值
axios.defaults.baseURL = 'http://localhost:7001'  // 设置基础URL
axios.defaults.timeout = 5000  // 设置超时时间
axios.defaults.withCredentials = true // 允许跨域请求携带cookie

// 添加请求头
axios.defaults.headers.common['Content-Type'] = 'application/json'  // 设置默认Content-Type
axios.defaults.headers.common['Accept'] = 'application/json'  // 设置默认Accept

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回错误状态码
      console.error('响应错误:', error.response.data)
      alert(error.response.data.message || '请求失败')
    } else if (error.request) {
      // 请求发送失败
      console.error('网络错误:', error.request)
      alert('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      console.error('请求错误:', error.message)
      alert('发生错误：' + error.message)
    }
    return Promise.reject(error)
  }
)

export default axios