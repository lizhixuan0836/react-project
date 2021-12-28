import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function ReactReduxHookPage() {
  // 使用方法类似于mapStateToProps
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  // 方法可以缓存起来用useCallback
  // const add = () => {
  //     dispatch({ type: 'ADD', payload: 10 })
  // }
  const add = useCallback(() => {
    dispatch({ type: 'ADD', payload: 10 })
  }, [dispatch])

  return (
    <div className='home-function'>
      <h1>{count}</h1>
      <button onClick={add}>add</button>
    </div>
  )
}

export default ReactReduxHookPage
