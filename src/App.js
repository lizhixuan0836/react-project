import './styles/App.scss'
import React, { Suspense } from 'react' // Suspense, lazy // useEffect
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Study from './views/study/Study'
import Login from './views/login/Login'
import { AppContext } from './context/AppContext'

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
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path='/' element={<Login></Login>} />
              <Route path='/study' element={<Study></Study>} />
            </Routes>
          </Suspense>
        </Router>
      </AppContext.Provider>
    </div>
  )
}

export default App
