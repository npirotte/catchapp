import React from 'react';
import Tappable from 'react-tappable';
import Sentry from 'react-sentry';
import { animation, Container } from 'touchstonejs';

import AuthStore from '../../stores/AuthStore';
import FriendsStore from '../../stores/FriendsStore';

const _friendStore = new FriendsStore();

import UsersList from '../../components/UsersList';

import { EventEmitter } from 'events';
const emitter = new EventEmitter();

const scrollable = Container.initScrollable();

export default React.createClass({

	displayName : 'ViewUsersList',

	mixins : [Sentry(), animation.Mixins.ScrollContainerToTop],

	statics : {
		navigationBar : 'main',
		getNavigation : function() {
			return {
				leftIcon : 'ion-android-menu',
				leftAction : emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title : 'Utilisateurs',
				titleAction : emitter.emit.bind(emitter, 'navigationBarTitleAction')
			};
		}
	},

	getInitialState : function()
	{
		this.userId = AuthStore.user().id;

		var friends = _friendStore.getFriends(this.userId);

		return {
			friends : friends
		}
	},

	componentDidMount : function()
	{

		var body = document.getElementsByTagName('body')[0];

/*		CatchsStore.emitter.on('update', this.getData);

		CatchsStore.emitter.once('noMoreItems', event => {
			this.setState({noMoreItems : true})
		});*/

		// navbar actions
		this.watch(emitter, 'navigationBarLeftAction', function () {
			body.classList.toggle('android-menu-is-open');
		});

		this.watch(emitter, 'navigationBarTitleAction', (event) => {
			this.scrollContainerToTop();
		});

		_friendStore.refresh(this.userId);

		this.watch(_friendStore.emitter, 'update:' + this.userId, this.getData);

	},

	getData : function()
	{
		this.setState({friends : _friendStore.getFriends(this.userId), loading : false});
		console.log(this.state);
	},

	render : function() {
		return (
			<Container direction="column">
				<Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
					<UsersList users={this.state.friends} />
				</Container>
			</Container>
			)
	}
});
