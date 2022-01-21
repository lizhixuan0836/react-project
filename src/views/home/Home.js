import VirtualList from 'components/virtualList/VirtualList'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { articleAll } from 'request/api'
import './Home.scss'

function Home() {
  const { name } = useSelector((state) => state.user)
  const [articles, setArticles] = useState([])
  useEffect(() => {
    articleAll().then((res) => {
      if (res.code === 0) {
        setArticles(res.data)
      }
    })
  }, [])
  return (
    <div className='home-function'>
      <h1>{name}</h1>
      {/* <div className='articles'>
        {articles.map((item, index) => (
          <div key={item._id}>{item.title}</div>
        ))}
      </div> */}
      <VirtualList listData={articles}></VirtualList>
    </div>
  )
}

export default Home
