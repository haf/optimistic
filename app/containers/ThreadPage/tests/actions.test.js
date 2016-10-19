import expect from 'expect';
import {
  sendMessage,
  changeMessage
} from '../actions';
import {
  SEND_MESSAGE,
  CHANGE_MESSAGE
} from '../constants';

describe('ThreadPage actions', () => {
  describe('send message', () => {
    it('sets "message" property', () => {
      expect(sendMessage('Hello world!')).toEqual({
        type: SEND_MESSAGE,
        message: 'Hello world!'
      });
    });
  });
  describe('change message', () => {
    it('sets "message" property', () => {
      expect(changeMessage('Hello world')).toEqual({
        type: CHANGE_MESSAGE,
        message: 'Hello world'
      });
    });
  });
});
