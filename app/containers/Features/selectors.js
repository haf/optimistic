import { createSelector } from 'reselect';

/**
 * Direct selector to the features state domain
 */
const selectFeaturesDomain = () => (state) => state.get('features');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Features
 */

const selectFeatures = () => createSelector(
  selectFeaturesDomain(),
  (substate) => substate.toJS()
);

export default selectFeatures;
export {
  selectFeaturesDomain,
};
