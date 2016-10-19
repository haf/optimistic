/**
*
* Input
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.styl';

class Input extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <input type="text" className='chat-input' value={this.props.value} {...this.props} />
    );
  }
}

export default Input;
