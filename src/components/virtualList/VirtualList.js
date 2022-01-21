import ArticleItem from 'components/articleItem/ArticleItem'
import React, { useState, useRef, useEffect } from 'react'
import './VirtualList.scss'

function VirtualList(props) {
  // 高度
  const [listHeight, setListHeight] = useState(0)
  //  单个高度
  const [size] = useState(200)
  //   屏幕高度
  const [screenHeight, setScreenHeight] = useState(800)
  //   头部的距离
  const [startOffset, setStartOffset] = useState(0)
  //   开始索引
  const [start, setStart] = useState(0)
  //   结束索引
  const [end, setEnd] = useState(0)
  //   可视的条数
  const [visibleCount, setVisibleCount] = useState(0)
  //   可视的数据
  const [visibleDetail, setVisibleDetail] = useState([])
  //偏移量对应的style
  const [getTransform, setTransform] = useState('')
  const { listData } = props
  //   外层ref
  const listRef = useRef(null)
  const scrollEvent = () => {
    const scrollTop = listRef.current.scrollTop
    // 设置开始索引
    setStart(Math.floor(scrollTop / size))
    // 设置结束索引
    setEnd(start + visibleCount)
    // 设置头部的距离
    setStartOffset(scrollTop - (scrollTop % size))
    // 设置偏移量
    setTransform(`translate3d(0,${startOffset}px,0)`)
  }
  useEffect(() => {
    // 设置浏览器可视高度
    setScreenHeight(document.body.clientHeight)
    setListHeight(listData.length + size)
    // 可视条数
    setVisibleCount(Math.ceil(screenHeight / size))
    // 可视数据
    setVisibleDetail(listData.slice(start, Math.min(end, listData.length) + 2))
    // 设置结束索引
    setEnd(start + visibleCount)
  }, [listData, size, screenHeight, visibleCount, end, start])
  return (
    <div className='list-container' ref={listRef} onScroll={scrollEvent}>
      <div className='list-phantom' style={{ height: listHeight + 'px' }}></div>
      <div className='list' style={{ transform: getTransform }}>
        {visibleDetail.map((item, index) => (
          <ArticleItem key={item._id} article={item} style={{ height: size + 'px' }}></ArticleItem>
        ))}
      </div>
      {/* <div className='list' style={{ top: getTop }}></div> */}
    </div>
    // <div>
    //   {listData.map((item, index) => (
    //     <div key={item._id}>{item.title}</div>
    //   ))}
    // </div>
  )
}

export default VirtualList
