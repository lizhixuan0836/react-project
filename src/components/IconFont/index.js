// iconfont组件
import { createFromIconfontCN } from '@ant-design/icons'
import scriptUrl from 'const/iconfont'
import './index.scss'
const IconFont = createFromIconfontCN({
  scriptUrl
})

export default function name({ iconName, isRotate, children }) {
  console.log(iconName, isRotate, 1111111)
  return (
    <>
      <IconFont type={iconName} className={{ rotate: isRotate }}></IconFont>
      {children || ''}
    </>
  )
}
