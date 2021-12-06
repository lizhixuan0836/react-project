import { countReducer } from './reducer'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise";

// const store = createStore(countReducer,applyMxiddleware(promise,thunk,logger))
const store = createStore(
    // 合并reducer
    combineReducers({ count: countReducer })
    // 中间件
    , applyMiddleware(promise, thunk, logger))

export default store