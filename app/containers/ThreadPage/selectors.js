import {
  createSelector,
  createStructuredSelector
} from 'reselect';

/**
 * Direct selector to the threadPage state domain
 */
//const selectThreadPage = () => (state) => state.get('thread');
const selectThreadPage = createStructuredSelector({});

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

export {
  selectThreadPage,
  selectChatMessage
};
