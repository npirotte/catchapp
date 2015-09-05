var {Mixins, animation, UI} = require('touchstonejs');
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

	mixins: [Sentry(), animation.Mixins.ScrollContainerToTop, Mixins.Transitions],

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

		return {
			friends : friends,
			selectedFriends : this.props.selectedFriends.slice() || [],
			query : ''
		}
	},

	componentDidMount ()
	{

		// navbar actions
		this.watch(emitter, 'navigationBarLeftAction',event => {
			this.transitionTo('main:catchs-form', {
				transition: 'reveal-from-bottom',
				viewProps: {}
			});
		});

		this.watch(emitter, 'navigationBarRightAction', event => {
			this.transitionTo('main:catchs-form', {
				transition: 'reveal-from-bottom',
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

	onCancel : function() {
		this.setState({query : ""});
	},

	filter (value)
	{
		var query = value;
		this.setState({query : query});
	},

	render () {
		return (
			<Container direction="column">
				<div className="search-header">
					<UI.SearchField onChange={this.filter} onCancel={this.onCancel} onClear={this.onCancel} value={this.state.query} type="text" placeholder="Rechercher" />
				</div>
				<Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
					{this.state.friends.map(function(friend, index) {

						var isFiltred = friend.fullName.toLowerCase().search(this.state.query.toLowerCase()) >= 0;

						var checked = this.state.selectedFriends.indexOf(friend.id) >= 0;

						var allreadySelected = this.props.selectedFriends.indexOf(friend.id) >= 0;

						if(allreadySelected || (this.state.query && !isFiltred)) return;

						return <CheckBox key={friend.id} className="ListItem" onChange={this.onChange} value={friend.id} defaultChecked={checked} >{friend.fullName}</CheckBox>

					}.bind(this))}
				</Container>
			</Container>
			)
	}
});
