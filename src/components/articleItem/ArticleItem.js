import React from 'react'
import './ArticleItem.scss'
function ArticleItem(props) {
  const { article } = props

  return (
    <>
      <div className='article-item'>
        {/* <!-- 显示文章列表 --> */}
        <h2 style={{ width: '900px' }}>
          {/* <nuxt-link :to='"/article/"+article._id'> */}

          {article.title}
          {/* </nuxt-link> */}
        </h2>
        <p>
          {/* <UserDisplay :user="article.author"></UserDisplay> */}
          <span className='action'>
            <i className='el-icon-view'>{article.views}</i>
          </span>
          <span className='action'>
            <i className='el-icon-thumb'>{article.like}</i>
          </span>
        </p>
      </div>
    </>
  )
}

export default ArticleItem
