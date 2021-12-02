
import './App.css';
import React from 'react';
import HomeClass from './views/HomeClass';
import HomeFunction from './views/HomeFunction';
import HomeClassConsumer from './views/HomeClassConsumer';
import HomeFunctionConsumer from './views/HomeFunctionConsumer';
import RCFieldForm from './views/RCFieldForm';
import AntdFormPage from './views/AntdFormPage';
import { AppContext } from './context/AppContext'

function App() {
  return (
    <div className="App">
      <AppContext.Provider value='app-context' >
        <HomeClass/>
        <hr/>
        <HomeFunction/>
        <hr/>
        <HomeClassConsumer/>
        <hr/>
        <HomeFunctionConsumer/>
        <hr/>
        <RCFieldForm/>
        <hr/>
        <AntdFormPage/>
      </AppContext.Provider>
    </div>
  );
}

export default App;
