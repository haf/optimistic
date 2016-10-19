/*
 *
 * ThreadPage
 *
 */

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Button} from 'components';
import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  sendMessage,
  changeMessage
} from './actions';

import './styles.styl';

export class ThreadPage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      chatMessage,
      onChangeMessage
    } = this.props;
    return (
      <div className='page thread-page'>
        <section className='page-contents'>
Donec id viverra lacus, nec semper odio. Duis efficitur lectus eget finibus pretium. Maecenas feugiat augue sed quam dapibus congue. Vivamus finibus commodo dolor, ac vulputate erat convallis id. Suspendisse condimentum, massa imperdiet aliquet commodo, odio lorem sodales urna, at commodo urna erat eu dolor. Aenean aliquet tempor ante vitae sagittis. Aliquam nec dui convallis, vulputate tellus eget, vulputate urna. In at erat et urna vehicula volutpat. Etiam at fermentum diam, at hendrerit purus. Curabitur laoreet interdum enim, eget imperdiet urna iaculis ac.
Vivamus rhoncus placerat augue, a efficitur elit tempus id. Cras interdum erat quis dolor eleifend, at vehicula mi vehicula. Aenean suscipit eget mi sit amet cursus. In orci eros, consectetur ac tristique sed, feugiat nec lectus. Praesent sem diam, consectetur quis feugiat id, eleifend at urna. Nulla facilisi. Sed aliquam nec tellus a efficitur. Suspendisse et venenatis ligula. Nulla lobortis enim sodales nulla porttitor accumsan. Suspendisse potenti. Praesent bibendum odio eget odio rutrum, sed feugiat libero volutpat. Aenean nibh purus, finibus vitae libero nec, pretium tempus urna. Phasellus eu ante quis dolor semper mollis eu tempor nibh. Proin eu vestibulum orci.
Phasellus quis quam vitae urna faucibus tempor. Maecenas et pellentesque augue. Morbi tristique mauris et dui laoreet, at convallis lectus finibus. Praesent ullamcorper, magna a auctor mattis, neque quam hendrerit ipsum, sed facilisis lectus eros eget arcu. Aliquam et quam vel leo dapibus faucibus fermentum id purus. Pellentesque hendrerit, risus id posuere auctor, velit turpis iaculis elit, sit amet facilisis ligula purus vitae ligula. Morbi turpis lorem, euismod in urna condimentum, rhoncus suscipit justo. Ut non blandit ipsum.
        </section>
        <section className='chat-typing'>
          <textarea rows="4" placeholder="Type your message here!" onChange={onChangeMessage} value={chatMessage}></textarea>
          <Button>Send message</Button>
        </section>
      </div>
    );
  }
}

ThreadPage.propTypes = {
  chatMessage: PropTypes.string,
  onSendMessage: PropTypes.func.isRequired,
  onChangeMessage: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    onSendMessage: evt => {
      if (typeof evt !== 'undefined' && evt.preventDefault) evt.preventDefault();
      if (!evt.target.value || evt.target.value === '') return;
      dispatch(sendMessage(evt.target.value));
    },
    onChangeMessage: evt => {
      dispatch(changeMessage(evt.target.value));
    },
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPage);
