/*
 *
 * ThreadPage actions
 *
 */

import {
  SEND_MESSAGE,
  CHANGE_MESSAGE
} from './constants';

export function changeMessage(message) {
  return {
    type: CHANGE_MESSAGE,
    message
  }
}

export function sendMessage(message) {
  return {
    type: SEND_MESSAGE,
    message
  };
}
