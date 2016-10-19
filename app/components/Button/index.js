import React from 'react';
import './styles.styl';

class Button extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <button {...this.props} className='chat-button'>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
