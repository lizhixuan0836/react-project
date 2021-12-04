import { countReducer } from './reducer'
import { createStore,applyMiddleware } from 'redux'
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise";

const store = createStore(countReducer,applyMiddleware(promise,thunk,logger))

export default store