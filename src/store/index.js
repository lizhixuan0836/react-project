import { countReducer } from './reducer'
import { createStore,applyMiddleware } from 'redux'
import logger from "redux-logger";
import thunk from "redux-thunk";

const store = createStore(countReducer,applyMiddleware(thunk,logger))

export default store