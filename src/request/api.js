//导入我们封装好的axios
import service, { Axios } from './index'

// 验证码
export const apiCaptcha = (_) => service.get('/api/captcha')
export const apiSendcode = (params) => service.get('/api/sendcode', { params })
// 注册
export const userRegister = (data) => service.post('/api/user/register', data)
export const userLogin = (data) => service.post('/api/user/login', data)
export const userInfo = (params) => service.get('/api/user/info', { params })
// 文件
export const apiUpload = (data, options) => Axios.post('/api/upload', data, options)
export const apiUploadFileChunk = (data, options) => Axios.post('/api/uploadFileChunk', data, options)
export const mergeFile = (data, options) => Axios.post('/api/mergeFile', data, options)
export const apiCheckFile = (data, options) => Axios.post('/api/checkFile', data, options)

// 文章
export const articleCreate = (data, options) => service.post('/api/article/create', data, options)
export const articleAll = (params) => service.get('/api/article', { params })
