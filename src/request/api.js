//导入我们封装好的axios
import service from './index'

// 验证码
export const apiCaptcha = (_) => service.get('/api/captcha')
// 注册
export const userRegister = (data) => service.post('/api//user/register', data)
