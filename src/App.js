import './styles/App.scss'
import React, { Suspense } from 'react' // Suspense, lazy // useEffect
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Study from './views/study/Study'
import Login from './views/login/Login'
import Regist from './views/login/Regist'
import Home from './views/home/Home'
import { AppContext } from './context/AppContext'
import User from 'views/user/User'
import MarkDown from 'views/markDown/MarkDown'
import ComHeader from 'views/components/ComHeader'
function App() {
  // useEffect(() => {
  //   const a = new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve('你好')
  //     }, 2000)
  //   })
  //   a.then((res) => {
  //     console.log(res)
  //   })
  // }, [])
  return (
    <div className='app'>
      <AppContext.Provider value='app-context'>
        <Router>
          <ComHeader />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path='/' element={<Login></Login>} />
              <Route path='/regist' element={<Regist></Regist>} />
              <Route exact path='/login' element={<Login></Login>} />
              <Route exact path='/home' element={<Home></Home>} />
              <Route path='/study' element={<Study></Study>} />
              <Route path='/User' element={<User></User>} />
              <Route path='/markDown' element={<MarkDown></MarkDown>} />
            </Routes>
          </Suspense>
        </Router>
      </AppContext.Provider>
    </div>
  )
}

export default App
