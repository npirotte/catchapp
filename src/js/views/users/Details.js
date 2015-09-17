var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var { animation, Mixins, UI } = require('touchstonejs');

import FriendshipButton from '../../components/FriendshipButton.js';

var ImageUrl = require('../../filters/ImageUrl');

import dispatcher from '../../lib/dispatcher';

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var ItemAvatar = require('../../components/ItemAvatar');

const scrollable = Container.initScrollable();

function getNavigation(props)
{
	return {
		leftArrow : true,
		title : props.userItem.fullName,
		leftAction : emitter.emit.bind(emitter, 'navigationBarLeftAction'),
		rightIcon : 'ion-plus',
		rightAction : emitter.emit.bind(emitter, 'createNewCatch'),
	}
}

module.exports = React.createClass({

	displayName : 'ViewUserDetails',

	mixins : [Sentry(), Mixins.Transitions],

	statics : {
		navigationBar : 'main',
		getNavigation : getNavigation
	},

	getInitialState : function() {
		return {
			user : this.props.userItem
		}
	},

	componentDidMount : function() {

		var previousView = this.props.previousView || 'main:users-list',
				previousViewProps = this.props.previousViewProps || {};

		this.watch(emitter, 'navigationBarLeftAction', event => {
			this.transitionTo(previousView, {
				transition : 'reveal-from-right',
				viewProps : previousViewProps
			});
		});

		this.watch(dispatcher, 'FriendsStore.friendshipUpdated.user:' + this.props.userItem.id, friendship => {
			this.state.user.friendship = friendship;
			this.setState(this.state);
		});

		emitter.once('createNewCatch', event => {
			var props = {
				recipents : [this.props.userItem.id],
				previousViewProps : this.props,
				previousView : 'main:users-details'
			}
			this.transitionTo('main:catchs-form', { viewProps : props });
		});

	},

	render : function() {
		var userImageUrl = ImageUrl(this.props.userItem.asset);

		return (
			<Container direction="column">
				<Container justify align="center" direction="column">
					<div>
						<ItemAvatar src={userImageUrl} losange="true" className="center margin" name={this.props.userItem.fullName} />
						<h1 className="text-center">{this.props.userItem.fullName}</h1>
						<FriendshipButton user={this.state.user} />
						<br/>
						<div className="text-center">
							<button className="button button-primary button--raised"  onClick={emitter.emit.bind(emitter, 'createNewCatch')}>
								Envoyer un Goop
							</button>
						</div>
					</div>
				</Container>
			</Container>
			)
	}

})
