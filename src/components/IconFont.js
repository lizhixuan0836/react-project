// iconfont组件
import { createFromIconfontCN } from '@ant-design/icons'
import scriptUrl from 'const/iconfont'
const IconFont = createFromIconfontCN({
  scriptUrl
})
export default function name({ iconName, children }) {
  return (
    <>
      <IconFont type={iconName}></IconFont>
      {children || ''}
    </>
  )
}
