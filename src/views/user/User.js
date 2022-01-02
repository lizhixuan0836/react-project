// 用户中心
import React, { useEffect, useState, useRef } from 'react'
import { userInfo, apiUpload } from 'request/api'
import { message, Button, Progress } from 'antd'
import './User.scss'

function User() {
  const [file, setFile] = useState(null)
  const [uploadPercent, setUploadPercent] = useState(0)
  const dragRef = useRef(null)
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
  // 拖拽文件上传
  const uploadDragFile = async () => {
    // 因为上传文件是二进制的,所以要放在formdata之上
    const form = new FormData()
    form.append('name', 'file')
    form.append('file', file)
    const res = await apiUpload(form, {
      onUploadProgress: (process) => {
        setUploadPercent(Number(((process.loaded / process.total) * 100).toFixed(2)))
        // console.log(process)
      }
    })
    console.log(res, 111)
  }
  // blob 二进制流文件处理成二进制
  const bolbToString = async (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      // 返回一个 ArrayBuffer 对象,读取文件并将一个包含文件内容的ArrayBuffer保存在result属性中
      reader.onload = () => {
        const ret = reader.result
          .split('')
          .map((v) => v.charCodeAt()) // 变成10进制的ASCII码
          .map((v) => v.toString(16)) // 变成16进制
          .map((v) => v.padStart(2, '0')) // 补全0
          .join(' ')
        resolve(ret)
      }
      // 返回返回二进制字符串
      reader.readAsBinaryString(blob)
      // // 返回一个 ArrayBuffer 对象
      // reader.readAsArrayBuffer(blob)
    })
  }
  // 是否是gif
  const isGif = async (file) => {
    // 通过图片的二进制头识别文件类型
    //  1.JPEG/JPG
    // - 文件头标识 (2 bytes): $ff, $d8 (SOI) (JPEG文件标识)
    // - 文件结束标识 (2 bytes): $ff, $d9 (EOI)
    // 3.PNG
    // - 文件头标识 (8 bytes)   89 50 4E 470D 0A 1A 0A
    // 4.GIF
    // - 文件头标识 (6 bytes)   47 49 46 38 39(37) 61
    //                        G  I  F  8 9 (7)  a
    const ret = await bolbToString(file.slice(0, 6))
    const isGifHead = ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61'
    return isGifHead
  }
  // 是否是图片
  const isImage = async (file) => {
    let gif = await isGif(file)
    return gif
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

  // 拖动弹框事件
  useEffect(() => {
    dragRef.current.addEventListener('dragover', (e) => {
      e.preventDefault()
      dragRef.current.style.borderColor = 'red'
    })
    dragRef.current.addEventListener('dragleave', (e) => {
      e.preventDefault()
      dragRef.current.style.borderColor = 'black'
    })
    dragRef.current.addEventListener('drop', async (e) => {
      e.preventDefault()
      dragRef.current.style.borderColor = 'black'
      const file = e.dataTransfer.files[0]

      const image = await isImage(file)
      console.log(image, 'iamge')
      if (image) {
        setFile(file ? file : null)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='home-function'>
      <h1>小文件上传</h1>
      <input type='file' onChange={handleFileChange} />
      <Button onClick={uploadFile}>点击上传</Button>
      <h1>拖拽文件上传</h1>
      <div className='drag-contain' ref={dragRef}>
        <input type='file' />
      </div>
      <Button onClick={uploadDragFile}>点击上传</Button>
      进度条：
      <Progress type='circle' percent={uploadPercent} />
    </div>
  )
}

export default User
