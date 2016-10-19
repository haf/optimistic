/**
*
* Button
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.styl';

class Button extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className='chat-button'>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

export default Button;
