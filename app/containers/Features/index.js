/*
 *
 * Features
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectFeatures from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class Features extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectFeatures();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Features);
