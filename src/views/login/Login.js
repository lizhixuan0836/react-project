import React, { useState } from 'react'

function Login() {
  const [title, setTitle] = useState('这是一个title')
  return (
    <div className='home-function'>
      <h1>{title}</h1>
      <button onClick={() => setTitle('')}>改变title</button>
    </div>
  )
}

export default Login
