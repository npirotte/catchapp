var {Transitions, animation} = require('../../touchstone');
var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');

var AuthStore = require('../../stores/AuthStore');
var FriendsStore = require('../../stores/FriendsStore'),
	_friendStore = new FriendsStore();

var CheckBox = require('../../components/CheckBox');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

const scrollable = Container.initScrollable();

module.exports = React.createClass({

	displayName : 'ViewUsersList',

	mixins: [Sentry(), animation.Mixins.ScrollContainerToTop, Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation () {
			return {
				leftArrow: true,
				leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title: 'Ajouter des amis',
				rightIcon: 'ion-plus',
				rightAction : emitter.emit.bind(emitter, 'navigationBarRightAction'),
			};
		}
	},

	getInitialState ()
	{
		this.userId = AuthStore.user().id;
		
		var friends = _friendStore.getFriends(this.userId);
		console.log(_friendStore.getFriends);

		return {
			friends : friends,
			selectedFriends : this.props.selectedFriends || []
		}
	},

	componentDidMount ()
	{

		// navbar actions
		this.watch(emitter, 'navigationBarLeftAction',event => {
			this.transitionTo('main:catchs-form', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});

		this.watch(emitter, 'navigationBarRightAction', event => {
			this.transitionTo('main:catchs-form', {
				transition: 'reveal-from-right',
				viewProps: {
					recipents : this.state.selectedFriends
				}
			});
		});

		this.watch(_friendStore.emitter, 'update:' + this.userId, this.getData);

	},

	getData ()
	{
		this.setState({friends : _friendStore.getFriends(this.userId), loading : false});
		console.log(this.state);
	},

	onChange (event)
	{
		var value = event.target.value,
			index = this.state.selectedFriends.indexOf(value)

		if (index < 0) {
			this.state.selectedFriends.push(value)
		} else {
			this.state.selectedFriends.splice(index, 1)
		}

		console.log(this.state.selectedFriends);
	},

	render () {
		return (
			<Container direction="column">
				<Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
					{this.state.friends.map(function(friend, index) {
						
						var checked = this.state.selectedFriends.indexOf(friend.id) >= 0;
						
						if(checked) return;

						return <CheckBox key={friend.id} className="ListItem" onChange={this.onChange} value={friend.id} defaultChecked={checked} >{friend.fullName}</CheckBox>

					}.bind(this))}
				</Container>
			</Container>
			)
	} 
});