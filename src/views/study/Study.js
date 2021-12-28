import React from 'react'
import HomeClass from './HomeClass'
import HomeFunction from './HomeFunction'
import HomeClassConsumer from './HomeClassConsumer'
import HomeFunctionConsumer from './HomeFunctionConsumer'
import RCFieldForm from './RCFieldForm'
import AntdFormPage from './AntdFormPage'
import ReduxPage from './ReduxPage'
import ReactReduxPage from './ReactReduxPage'
import ReactReduxHookPage from './ReactReduxHookPage'
class Study extends React.Component {
  render() {
    return (
      <>
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
      </>
    )
  }
}

export default Study
