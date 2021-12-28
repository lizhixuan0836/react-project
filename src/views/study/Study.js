import React, { lazy } from 'react'
const HomeClass = lazy(() => import('./HomeClass'))
const HomeFunction = lazy(() => import('./HomeFunction'))
const HomeClassConsumer = lazy(() => import('./HomeClassConsumer'))
const HomeFunctionConsumer = lazy(() => import('./HomeFunctionConsumer'))
const RCFieldForm = lazy(() => import('./RCFieldForm'))
const AntdFormPage = lazy(() => import('./AntdFormPage'))
const ReduxPage = lazy(() => import('./ReduxPage'))
const ReactReduxPage = lazy(() => import('./ReactReduxPage'))
const ReactReduxHookPage = lazy(() => import('./ReactReduxHookPage'))
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
