import { getStore } from 'utils/util'

export const countReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case 'ADD':
      return state + payload
    case 'MINUS':
      return state - payload
    default:
      return state
  }
}

// 默认是读取本地
const user = getStore({ name: 'userInfo' }) || {}
export const userReducer = (state = user, { type, payload }) => {
  switch (type) {
    case 'SET_USER':
      return { ...state, ...payload }
    // case 'MINUS':
    //   return state - payload
    default:
      return state
  }
}
