/**
*
* UserDetails
*
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.styl';

function UserDetails() {
  return (
    <div className='user-details'>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

export default UserDetails;
