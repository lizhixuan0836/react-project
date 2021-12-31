/* eslint-disable */
// 自定义hooks

import { useCallback, useEffect, useRef } from 'react'

const useTimeoutFn = (fn, ms) => {
  const ready = useRef(false)
  const timeout = useRef()
  const callback = useRef(fn)

  const isReady = useCallback(() => ready.current, [])

  const set = useCallback(() => {
    ready.current = false
    timeout.current && clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      ready.current = true
      callback.current()
    }, ms)
  }, [ms])

  const clear = useCallback(() => {
    ready.current = null
    timeout.current && clearTimeout(timeout.current)
  }, [])

  useEffect(() => {
    set()

    return clear
  }, [ms, clear, set])

  return [isReady, set, clear]
}

// 防抖（debounce）: 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户连续输入，只需要在输入结束后做一次校验即可，比如input搜索，校验
export const useDebounce = (fn, ms = 0, deps = []) => {
  const [isReady, reset, clear] = useTimeoutFn(fn, ms)

  useEffect(reset, deps)
}

const useThrottleTimeoutFn = (fn, ms) => {
  const ready = useRef(false)
  const timeout = useRef()
  const callback = useRef(fn)

  const isReady = useCallback(() => ready.current, [])

  const setThrottle = useCallback(() => {
    ready.current = false

    if (!timeout.current) {
      timeout.current = true
      timeout.current = setTimeout(() => {
        ready.current = true
        timeout.current = null
        callback.current()
      }, ms)
    }
  }, [ms])

  const clearThrottle = useCallback(() => {
    ready.current = null
    timeout.current && clearTimeout(timeout.current)
  }, [])

  useEffect(() => {
    setThrottle()

    return clearThrottle
  }, [ms, setThrottle, clearThrottle])

  return { isReady, setThrottle, clearThrottle }
}
// 节流（throttle）：每隔一段时间执行一次，也就是降低频率，将高频操作优化成低频操作。通常使用场景： 滚动条事件，窗口resize事件，通常每隔100-500ms执行一次
export const useThrottle = (fn, ms = 0, deps = []) => {
  const { setThrottle } = useThrottleTimeoutFn(fn, ms)

  useEffect(setThrottle, deps)
}
