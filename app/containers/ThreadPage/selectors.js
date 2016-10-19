import { createSelector } from 'reselect';

/**
 * Direct selector to the threadPage state domain
 */
const selectThreadPage = () => (state) => state.get('threadPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ThreadPage
 */

const selectChatMessage = () => createSelector(
  selectThreadPage(),
  (pageState) => pageState.get('chatMessage') //pageState.toJS()
);

export default selectThreadPage;
export {
  selectThreadPage,
  selectChatMessage
};
