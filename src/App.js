import './styles/App.scss'
// import './styles/App.css'
import React, { useEffect } from 'react'
import HomeClass from './views/HomeClass'
import HomeFunction from './views/HomeFunction'
import HomeClassConsumer from './views/HomeClassConsumer'
import HomeFunctionConsumer from './views/HomeFunctionConsumer'
import RCFieldForm from './views/RCFieldForm'
import AntdFormPage from './views/AntdFormPage'
import ReduxPage from './views/ReduxPage'
import ReactReduxPage from './views/ReactReduxPage'
import ReactReduxHookPage from './views/ReactReduxHookPage'
import { AppContext } from './context/AppContext'

function App() {
  useEffect(() => {
    const a = new Promise((resolve) => {
      setTimeout(() => {
        resolve('你好')
      }, 2000)
    })
    a.then((res) => {
      console.log(res)
    })
  }, [])
  return (
    <div className='app'>
      <AppContext.Provider value='app-context'>
        <HomeClass />
        <hr />
        <HomeFunction />
        <hr />
        <HomeClassConsumer />
        <hr />
        <HomeFunctionConsumer />
        <hr />
        <RCFieldForm />
        <hr />
        <AntdFormPage />
        <hr />
        <ReduxPage />
        <hr />
        <ReactReduxPage />
        <hr />
        <ReactReduxHookPage />
        <hr />
      </AppContext.Provider>
    </div>
  )
}

export default App
