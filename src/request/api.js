//导入我们封装好的axios
import service from './index'

// 验证码
export const apiCaptcha = (info) => service.get('/api/captcha', info)
