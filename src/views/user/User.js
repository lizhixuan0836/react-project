// 用户中心
import React, { useEffect, useState, useRef } from 'react'
import { userInfo, apiUpload, apiUploadFileChunk, mergeFile } from 'request/api'
import { message, Button, Progress } from 'antd'
import './User.scss'
import SparkMD5 from 'spark-md5'
import IconFont from 'components/IconFont/index'

function User() {
  const CHUNK_SIZE = 0.5 * 1024 * 1024 //0.5m
  const [file, setFile] = useState(null)
  // 文件上传进度
  const [uploadPercent, setUploadPercent] = useState(0)
  // 计算hash进度
  const [hashProgress, setHashProgress] = useState(0)
  // 切片的文件
  const [chunkFile, setChunkFile] = useState(null)
  // 切片hash进度
  const [chunkHashProgress, setChunkHashProgress] = useState(0)
  // // 切片hash的值
  // const [chunkHash, setChunkHash] = useState('')
  // 切片chunks进度
  const [chunks, setChunks] = useState([])

  // cube立方体宽度
  const [cubeWidth, setCubeWidth] = useState(0)
  // 2个ref
  const dragRef = useRef(null)
  const dragChunkRef = useRef(null)
  // 最普通的点击上传
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // if (!file) {
    //   return
    // }
    setFile(file ? file : null)
  }
  // 最普通的上传文件
  const uploadFile = async () => {
    // 因为上传文件是二进制的,所以要放在formdata之上
    const form = new FormData()
    form.append('name', 'file')
    form.append('file', file)
    const res = await apiUpload(form)
    if (res.data && res.data.code === 0) {
      message.success(`上传成功路径为：${res.data.data.url}`)
    }
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
      }
    })
    if (res.data && res.data.code === 0) {
      message.success(`上传成功路径为：${res.data.data.url}`)
    }
    // 计算hash两种方式
    const chunks = createFileChunk(file)
    // 计算md5不要直接在主线程计算否则卡死
    const hash = await calculateHashWorker(chunks)
    const hashIdle = await calculateHashIdle(chunks)
    console.log(hash, hashIdle, 'hash文件')
  }
  // 拖拽切片文件上传
  const uploadChunkFile = async () => {
    const chunks = createFileChunk(chunkFile)
    // 效率高用于比较是否相同文件
    const hashSample = await calclateHashSample(chunkFile)
    // 给后端的文件
    let mapChunks = chunks.map((chunk, index) => {
      const name = hashSample + '_' + index
      return {
        hash: hashSample,
        name,
        index,
        chunk: chunk.file,
        process: 0 // 后续发送接口process持续变化
      }
    })
    // // 先把chunkHash设置为抽样hash的值
    // setChunkHash(hashSample)
    // 上传切片
    await uploadChunks(mapChunks)
  }
  // promise上传切片
  const uploadChunks = async (chunks) => {
    const resultChunks = chunks
    const request = chunks
      .map((chunk) => {
        // 转成promise
        const form = new FormData()
        form.append('chunk', chunk.chunk)
        form.append('hash', chunk.hash)
        form.append('name', chunk.name)
        form.append('index', chunk.index)
        return { form, index: chunk.index }
      })
      .map(({ form, index }) => {
        return apiUploadFileChunk(form, {
          onUploadProgress: (process) => {
            // 不是整体的进度条了，而是每个区块有自己的进度条，整体的进度条需要计算
            resultChunks[index].process = Number(((process.loaded / process.total) * 100).toFixed(2))
            // 更新区块（主要是进度条）!!!对象数组是引用方式 , 对于 react 来说它的值都是地址 (涉及到 tree diff)，因为没有被重新赋值 (地址没有改变)，所以 react 会认为仍然是之前的元素 (element)，则不更新视图。
            setChunks(() => [...resultChunks])
          }
        })
      })
    // 切片（缺点：请求过多浏览器卡顿）
    await Promise.all(request)
    // 上传完切片合并文件
    await mergeRequest(chunks)
  }

  // ！！！合并请求，进行异步的并发量控制
  const mergeRequest = async (chunks) => {
    // ext为上传的chunks里面的name
    mergeFile({
      ext: chunkFile.name.split('.').pop(), // 后缀名
      size: CHUNK_SIZE,
      hash: chunks[0].hash.split('_')[0]
    })
  }
  // 使用webwoker计算md5(缺点：1、很难和npm包产生联系 2、 sparkmd5要进行毫秒级的控制， 如果加载文件大于这个时间就不行了)
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
  // 用时间切片的方式去做(用空闲时间去做)
  const calculateHashIdle = (chunks) => {
    return new Promise((resolve) => {
      const spark = new SparkMD5.ArrayBuffer()
      let count = 0
      let progress = 0
      const appendToSpark = async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            spark.append(e.target.result)
            resolve()
          }
          reader.readAsArrayBuffer(file)
        })
      }
      const workLoop = async (deadline) => {
        // 有任务，且空闲时间
        while (count < chunks.length && deadline.timeRemaining() > 1) {
          await appendToSpark(chunks[count].file)
          count++
          if (count < chunks.length) {
            // 依然在计算
            progress = ((count * 100) / chunks.length).toFixed(2)
          } else {
            progress = 100
            resolve(spark.end())
          }
          setHashProgress(progress)
        }
        // 持续执行
        window.requestIdleCallback(workLoop)
      }
      // 启动一次：
      // 上面六个步骤完成后没超过 16 ms，说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务。
      window.requestIdleCallback(workLoop)
    })
  }
  // 抽样hash（不算全量），损失一部分精度换取效率，布隆过滤器
  // 1个G的文件，抽样后5m以内
  // hash一样，文件不一定一样；hash不一样，文件一定不一样
  const calclateHashSample = async (file) => {
    return new Promise((resolve) => {
      const spark = new SparkMD5.ArrayBuffer()
      const reader = new FileReader()
      const size = file.size
      const offset = 2 * 1024 * 1024
      // 第一个2M，最后一个区块数据全要
      let chunks = [file.slice(0, offset)]
      let cur = offset
      while (cur < size) {
        if (cur + offset >= size) {
          // 最后一个
          chunks.push(file.slice(cur, size))
        } else {
          // 中间的，取前中后各2个字节
          const mid = cur + offset / 2
          const end = cur + offset
          chunks.push(file.slice(cur, cur + 2))
          chunks.push(file.slice(mid, mid + 2))
          chunks.push(file.slice(end - 2, end))
        }
        cur += offset
      }
      reader.onload = (e) => {
        spark.append(e.target.result)
        resolve(spark.end())
      }
      // reader.readAsArrayBuffer(chunks)
      reader.readAsArrayBuffer(new Blob(chunks))
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
    return chuks
  }
  // 设置立方体的个数和总体切片进度
  useEffect(() => {
    // 10个chunk，取4 * 4
    // 向上取平方根
    setCubeWidth(Math.ceil(Math.sqrt(chunks.length)) * 14)
    // 设置总体chunk进度
    let loaded = 0
    let chunksSize = chunks.reduce((acc, cur) => {
      return acc + cur.chunk.size
    }, 0)
    // 非空数组判断
    if (!chunks.length) {
      loaded = 0
    } else {
      loaded = chunks.map((item) => item.chunk.size * (item.process || 0)).reduce((acc, cur) => acc + cur)
    }
    if (chunksSize) {
      setChunkHashProgress(Number((loaded / chunksSize).toFixed(2)))
    }
  }, [chunks])

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

    dragChunkRef.current.addEventListener('dragover', (e) => {
      e.preventDefault()
      dragChunkRef.current.style.borderColor = 'red'
    })
    dragChunkRef.current.addEventListener('dragleave', (e) => {
      e.preventDefault()
      dragChunkRef.current.style.borderColor = 'black'
    })
    dragChunkRef.current.addEventListener('drop', async (e) => {
      e.preventDefault()
      dragChunkRef.current.style.borderColor = 'black'
      const file = e.dataTransfer.files[0]
      setChunkFile(file ? file : null)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='home-function'>
      <h1>小文件上传</h1>
      <input type='file' onChange={handleFileChange} />
      <Button onClick={uploadFile}>点击上传gif,png,jpg图片</Button>
      <h1>拖拽文件上传</h1>
      <div className='drag-contain' ref={dragRef}>
        <input type='file' className='none-input' />
      </div>
      <Button onClick={uploadDragFile}>点击上传gif,png,jpg图片</Button>
      上传进度条：
      <Progress type='circle' percent={uploadPercent} />
      计算hash进度条：
      <Progress type='circle' percent={hashProgress} />
      <h1>拖拽切片文件上传</h1>
      <div className='drag-contain' ref={dragChunkRef}>
        <input type='file' className='none-input' />
      </div>
      <Button onClick={uploadChunkFile}>点击上传大文件</Button>
      {/* chunk.progress 如果progress -1 则 红色  100 成功*/}
      <div
        className='cube-contain'
        style={{
          width: cubeWidth + 'px'
        }}
      >
        {chunks.map((chunk) => {
          return (
            <div
              className={`cube${chunk.process > 0 && chunk.process < 100 ? ' uploading' : ''}${
                chunk.process === 100 ? ' success' : ''
              }${chunk.process < 0 ? ' error' : ''}`}
              key={chunk.name}
            >
              {/* 正在上传则显示loading */}
              {chunk.process > 0 && chunk.process < 100 ? (
                <IconFont iconName={'icon-jiazai'} isRotate={true}></IconFont>
              ) : (
                ''
              )}
            </div>
          )
        })}
      </div>
      <Progress type='circle' percent={chunkHashProgress} />
    </div>
  )
}

export default User
