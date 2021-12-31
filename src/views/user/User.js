// 用户中心
import React, { useEffect } from 'react'
import { userInfo } from 'request/api'
import { message } from 'antd'

function User() {
  // 用户信息
  useEffect(() => {
    const params = {}
    userInfo(params).then((res) => {
      console.log(res)
      if (res.code === 0) {
        message.success('查询成功')
      }
    })
  }, [])
  return (
    <div className='home-function'>
      <h1>666</h1>
    </div>
  )
}

export default User
