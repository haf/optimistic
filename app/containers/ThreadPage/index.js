/*
 *
 * ThreadPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectThreadPage from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class ThreadPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectThreadPage();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPage);
