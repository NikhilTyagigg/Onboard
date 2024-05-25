import {combineReducers} from 'redux';
import document from './document';
import layout from '../layout';
import navbar from './navbar';

const reducer = combineReducers({
    document: document,
    layout: layout,
    navbar: navbar
});

export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state.deal = undefined;
  }
  return reducer(state, action);
};
