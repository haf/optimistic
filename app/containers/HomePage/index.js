/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { createStructuredSelector } from 'reselect';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {Button,Input} from 'components';
import {changeEmail, changeName} from './actions';

export class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      onSubmitForm,
      name,
      onChangeName,
      email,
      onChangeEmail
    } = this.props;
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
          <span>by Henrik Feldt</span>
        </h1>
        <form className="form-group" onSubmit={onSubmitForm}>
          <Input placeholder="YOUR NAME" required="required" onChange={onChangeName} value={name} />
          <Input placeholder="YOUR E-MAIL" type="email" required="required" onChange={onChangeEmail} value={email} />
          <Button>
            Chat!
          </Button>
        </form>
      </div>
    );
  }
}

HomePage.propTypes = {
  changeRoute: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  name: React.PropTypes.string,
  onChangeName: React.PropTypes.func,
  email: React.PropTypes.string,
  onChangeEmail: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeName: evt => dispatch(changeName(evt.target.value)),
    onChangeEmail: evt => dispatch(changeEmail(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(push('/chat'));
    },

    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
