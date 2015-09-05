import { Container, animation, UI } from 'touchstonejs';
import React from 'react';
import Sentry from 'react-sentry';
import events from 'events';

import SearchStore from '../../stores/SearchStore';

import UsersList from '../../components/UsersList';

const emitter = new events.EventEmitter();
const scrollable = Container.initScrollable();
const searchStore = new SearchStore();

export default React.createClass({

  displayName : 'Search',

  mixins : [Sentry(), animation.Mixins.ScrollContainerToTop],

  statics : {
    navigationBar : 'main',
    getNavigation : function() {
      return {
				leftIcon : 'ion-android-menu',
				leftAction : emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title : 'Rechercher'
			};
    }
  },

  componentDidMount : function() {

    var body = document.getElementsByTagName('body')[0];

    // navbar actions
		this.watch(emitter, 'navigationBarLeftAction', function () {
			body.classList.toggle('android-menu-is-open');
		});

    this.watch(searchStore.emitter, 'update', () => {
      this.setState({results : searchStore.getData()});
    });
  },

  getInitialState : function() {
    return {
      query : '',
      results : []
    }
  },

  filter : function(value) {
    this.setState({query : value});
    searchStore.setQuery(value);
  },

  onCancel : function() {
    this.setState({query : ''});
  },

  render : function() {
      return (
        <Container direction="column">
          <UI.SearchField onChange={this.filter} onCancel={this.onCancel} onClear={this.onCancel} value={this.state.query} type="text" placeholder="Rechercher" />
          <Container fill scrollable={scrollable} ref="scrollContainer">
            <UsersList users={this.state.results} />
          </Container>
        </Container>
      )
  }

});
