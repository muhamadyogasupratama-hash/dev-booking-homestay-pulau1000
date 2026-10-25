import axios from 'axios'

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token')
      if (window.location.pathname !== '/') window.location.assign('/')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
