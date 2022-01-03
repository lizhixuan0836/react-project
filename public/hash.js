/* eslint-disable no-restricted-globals */
// hash读取
// 引入spark-md5
// webWorker加载文件的特有写法
self.importScripts('./static/spark-md5.min.js')
// 接收主线程传递的数据
self.onmessage = (e) => {
  const { chunks } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let progress = 0
  let count = 0
  const loadNext = (index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      count++
      spark.append(e.target.result)
      // 因为是增量计算
      if (count === chunks.length) {
        self.postMessage({
          progress: 100,
          hash: spark.end()
        })
      } else {
        progress += 100 / chunks.length
        self.postMessage({
          progress
        })
        loadNext(count)
      }
    }
    reader.readAsArrayBuffer(chunks[count].file)
  }

  loadNext(0)
}
