import React, { useState } from 'react'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import store from 'store'

function ComHeader() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('home')
  const menuArr = [
    {
      key: 'home',
      content: '首页'
    },
    {
      key: 'study',
      content: '学习中心'
    },
    {
      key: 'user',
      content: '用户中心（上传文件）'
    },
    {
      key: 'markDown',
      content: 'markDown编辑器'
    }
  ]
  const handleClick = (e) => {
    navigate(`/${e.key}`)
    setCurrent(e.key)
    console.log(store.getState().user)
  }
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode='horizontal'>
      {menuArr.map((item) => (
        <Menu.Item key={item.key}>{item.content}</Menu.Item>
      ))}
    </Menu>
  )
}

export default ComHeader
