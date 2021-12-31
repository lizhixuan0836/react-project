/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}
/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const { name, content, type } = params
  const obj = {
    dataType: typeof content,
    content,
    type,
    datetime: new Date().getTime()
  }
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */

export const getStore = (params) => {
  const { name } = params
  let obj = {}
  let content = ''
  obj = window.sessionStorage.getItem(name)
  if (validatenull(obj)) obj = window.localStorage.getItem(name)
  if (validatenull(obj)) {
    return undefined
  }
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = !!obj.content
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  // eslint-disable-line
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = (params) => {
  const { name } = params
  window.localStorage.removeItem(name)
  window.sessionStorage.removeItem(name)
}
