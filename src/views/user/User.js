// 用户中心
import React, { useEffect, useState, useRef } from 'react'
import { userInfo, apiUpload } from 'request/api'
import { message, Button, Progress } from 'antd'
import './User.scss'

function User() {
  const CHUNK_SIZE = 0.5 * 1024 * 1024 //0.5m
  const [file, setFile] = useState(null)
  // 文件上传进度
  const [uploadPercent, setUploadPercent] = useState(0)
  // 计算hash进度
  const [hashProgress, setHashProgress] = useState(0)
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
    const chunks = createFileChunk(file)
    console.log(chunks, '切片')
    // 计算md5不要直接在主线程计算否则卡死
    const hash = await calculateHashWorker(chunks)
    console.log(hash, '文件hash计算完毕')
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
  // 使用webwoker计算md5
  const calculateHashWorker = async (chunks) => {
    return new Promise((resolve) => {
      // 开一个全新的进程
      const worker = new Worker('/hash.js')
      console.log(worker)
      // 吧任务给他
      worker.postMessage({ chunks: chunks })
      // 没算完一个回传一个信息
      worker.onmessage = (e) => {
        console.log(e)
        const { progress, hash } = e.data
        console.log(progress, hash)
        setHashProgress(Number(progress.toFixed(2)))
        // 如果有hash说明计算完毕了
        if (hash) {
          resolve(hash)
        }
      }
    })
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
          .map((v) => v.padStart(2, '0').toUpperCase()) // 补全0
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
  // 是否是Png
  const isPng = async (file) => {
    const ret = await bolbToString(file.slice(0, 8))
    const isPngHead = ret === '89 50 4E 47 0D 0A 1A 0A'
    return isPngHead
  }
  // 是否是Jpg
  const isJpg = async (file) => {
    const len = file.size
    const start = await bolbToString(file.slice(0, 2))
    const end = await bolbToString(file.slice(-2, len))
    const isJpgHead = start === 'FF D8' && end === 'FF D9'
    return isJpgHead
  }
  // 是否是图片
  const isImage = async (file) => {
    let gif = await isGif(file)
    let png = await isPng(file)
    let jpg = await isJpg(file)
    return gif || png || jpg
  }

  // 创建文件切片
  const createFileChunk = (file, size = CHUNK_SIZE) => {
    const chuks = []
    let cur = 0
    while (cur < file.size) {
      chuks.push({ index: cur, file: file.slice(cur, cur + size) })
      cur += size
    }
    chuks.push({ index: file.size, file: file.slice(cur, file.size) })
    return chuks
  }

  // 用户信息
  useEffect(() => {
    const params = {}
    userInfo(params).then((res) => {
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
      if (image) {
        setFile(file ? file : null)
      } else {
        message.warning('上传文件格式不是gif，jpg，png')
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
      上传进度条：
      <Progress type='circle' percent={uploadPercent} />
      计算hash进度条：
      <Progress type='circle' percent={hashProgress} />
    </div>
  )
}

export default User
