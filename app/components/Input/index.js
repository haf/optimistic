/**
*
* Input
*
*/

import React, {Component, PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.styl';

class Input extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <input type="text" className='chat-input' 
             value={this.props.value}
             {...this.props} />
    );
  }
}

Input.propTypes = {
  value: PropTypes.string
};

export default Input;