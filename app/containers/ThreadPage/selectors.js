import { createSelector } from 'reselect';

/**
 * Direct selector to the threadPage state domain
 */
const selectThreadPageDomain = () => (state) => state.get('threadPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ThreadPage
 */

const selectThreadPage = () => createSelector(
  selectThreadPageDomain(),
  (substate) => substate.toJS()
);

export default selectThreadPage;
export {
  selectThreadPageDomain,
};
