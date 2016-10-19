/*
 *
 * ThreadPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SEND_MESSAGE,
  CHANGE_MESSAGE
} from './constants';

const initialState = fromJS({});

function threadPageReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return state;
    default:
      return state;
  }
}

export default threadPageReducer;
