import expect from 'expect';
import {
  CHANGE_NAME,
  CHANGE_EMAIL
} from '../constants';
import {
  changeName,
  changeEmail
} from '../actions';

describe('Home Actions', () => {
  describe('changeName', () => {
    it('sets "name" property', () => {
      expect(changeName('haf')).toEqual({
        type: CHANGE_NAME,
        name: 'haf',
      });
    });
  });
  describe('changeEmail', () => {
    it('sets "email" property', () => {
      expect(changeEmail('henrik@haf.se')).toEqual({
        type: CHANGE_EMAIL,
        email: 'henrik@haf.se',
      });
    });
  });
});