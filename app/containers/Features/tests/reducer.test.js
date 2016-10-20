import expect from 'expect';
import featuresReducer from '../reducer';
import { fromJS } from 'immutable';

describe('featuresReducer', () => {
  it('returns the initial state', () => {
    expect(featuresReducer(undefined, {})).toEqual(fromJS({}));
  });
});
