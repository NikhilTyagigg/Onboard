// ** Reducers Imports
import {combineReducers} from 'redux';
import layout from "./layout"
import navbar from "./navbar"

const rootReducer = combineReducers({
    layout: layout,
    navbar: navbar,
});

export default rootReducer
