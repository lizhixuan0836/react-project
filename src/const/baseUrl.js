//保存环境变量
const isPrd = process.env.NODE_ENV === 'production'

//区分开发环境还是生产环境基础URL
export const baseUrl = isPrd ? 'https://www.production.com' : 'http://localhost:3000'
