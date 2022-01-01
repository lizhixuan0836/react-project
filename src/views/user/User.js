// 用户中心
import React, { useEffect, useState } from 'react'
import { userInfo, apiUpload } from 'request/api'
import { message, Button } from 'antd'

function User() {
  const [file, setFile] = useState(null)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // if (!file) {
    //   return
    // }
    setFile(file ? file : null)
  }
  const uploadFile = async () => {
    // 因为上传文件是二进制的,所以要放在formdata之上
    const form = new FormData()
    form.append('name', 'file')
    form.append('file', file)
    const res = await apiUpload(form)
    console.log(res, 111)
  }
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
      <input type='file' onChange={handleFileChange} />
      <Button onClick={uploadFile}>点击上传</Button>
    </div>
  )
}

export default User
