import expect from 'expect';
import threadPageReducer from '../reducer';
import { fromJS } from 'immutable';

describe('threadPageReducer', () => {
  it('returns the initial state', () => {
    expect(threadPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});