/**
 * 函数组件的Consumer传值
 * */
import { AppContext } from '@/context/AppContext'
const { Consumer } = AppContext
function HomeFunction() {
  return (
    <Consumer>
      {(context) => {
        return (
          <>
            <h2>函数组件的Consumer传值</h2>
            <div>app传来的值：{context}</div>
          </>
        )
      }}
    </Consumer>
  )
}

export default HomeFunction
