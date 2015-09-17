import React from 'react';
import Sentry from 'react-sentry';
import { EventEmitter } from 'events';
//import { Container, animation } from 'touchstonejs';
var {Transitions, Container, animation } = require('../../touchstone');

import dispatcher from '../../lib/dispatcher';

import PendingFriendshipsStore from '../../stores/PendingFriendshipsStore.js';

import UsersList from '../../components/UsersList';

const emitter = new EventEmitter();
const scrollable = Container.initScrollable();
const pendingFriendshipsStore = new PendingFriendshipsStore();

export default React.createClass({

  displayName : 'pendingFriendships',

  mixins : [Sentry(), animation.Mixins.ScrollContainerToTop, Transitions],

  statics : {
    navigationBar : 'main',
    getNavigation : function() {
      return {
				leftIcon : 'ion-android-menu',
				leftAction : emitter.emit.bind(emitter, 'navigationBarLeftAction'),
        rightIcon: 'ion-plus',
        rightAction : emitter.emit.bind(emitter, 'addNewFriends'),
				title : 'Demandes d\'amitié',
        titleAction : emitter.emit.bind(emitter, 'navigationBarTitleAction')
			};
    }
  },


  getInitialState : function() {
    return {
      pendingFriendships : []
    }
  },

  componentDidMount : function() {

    var body = document.getElementsByTagName('body')[0];

    // navbar actions
		this.watch(emitter, 'navigationBarLeftAction', function () {
			body.classList.toggle('android-menu-is-open');
		});

    this.watch(dispatcher, 'PendingFriendshipsStore.update', () => {
      this.setState({ pendingFriendships : pendingFriendshipsStore.getData() });
    });

    emitter.once('addNewFriends', event => {
      console.log(event);
      this.transitionTo('main:search', {});
    });

    pendingFriendshipsStore.refresh();

  },

  render : function() {
    return (
      <Container direction="column">
        <Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
          <UsersList users={this.state.pendingFriendships} previousView={'main:pending-friendships'} previousViewProps={{ goBackState : this.state}} />
        </Container>
      </Container>
    )
  }

})
