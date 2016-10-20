import React, { Component, PropTypes } from 'react';
import './styles.styl';

class Button extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <button {...this.props} className='chat-button'>
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.array
};

export default Button;