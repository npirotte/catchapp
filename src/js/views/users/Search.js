import { Container, animation, UI } from 'touchstonejs';
import React from 'react';
import Sentry from 'react-sentry';
import events from 'events';

import SearchStore from '../../stores/SearchStore';

import UsersList from '../../components/UsersList';
var PullToRefreshContainer = require('../../components/PullToRefreshContainer');

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
				title : 'Rechercher',
        titleAction : emitter.emit.bind(emitter, 'navigationBarTitleAction')
			};
    }
  },

  componentDidMount : function() {

    var body = document.getElementsByTagName('body')[0];

    // navbar actions
		this.watch(emitter, 'navigationBarLeftAction', function () {
			body.classList.toggle('android-menu-is-open');
		});

    this.watch(emitter, 'navigationBarTitleAction', (event) => {
			this.refs.pullToRefresh.scrollContainerToTop();
		});

    this.watch(searchStore.emitter, 'update', () => {
      this.setState({results : searchStore.getData()});
    });
  },

  getInitialState : function() {
    if (this.props.goBackState) return this.props.goBackState;
    return {
      query : '',
      results : []
    }
  },

  filter : function(value) {
    this.setState({query : value});
    this.refs.pullToRefresh.scrollContainerToTop();
    searchStore.setQuery(value);
  },

  onCancel : function() {
    this.setState({query : ''});
  },

  loadMore : function() {
    searchStore.getMore();
  },

  render : function() {
      return (
        <Container direction="column">
          <div className="padding"><UI.SearchField onChange={this.filter} onCancel={this.onCancel} onClear={this.onCancel} value={this.state.query} type="text" placeholder="Rechercher" /></div>
          <PullToRefreshContainer onRefresh={this.onRefresh}  onInfinite={this.loadMore} loading={this.state.loading} ref="pullToRefresh" >
            <UsersList users={this.state.results} previousView={'main:search'} previousViewProps={{ goBackState : this.state}} />
          </PullToRefreshContainer>
        </Container>
      )
  }

});
