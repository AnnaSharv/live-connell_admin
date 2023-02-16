import * as reducers from './reducers/index'
import {combineReducers} from 'redux'


const reducer = combineReducers(reducers)

const rootReducer = (state, action) => {
    return reducer(state, action)
}

export default rootReducer