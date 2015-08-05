var animation = require('../../touchstone/animation');
var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');

var AuthStore = require('../../stores/AuthStore');
var FriendsStore = require('../../stores/FriendsStore'),
	_friendStore = new FriendsStore();

var UsersList = require('../../components/UsersList');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

const scrollable = Container.initScrollable();

module.exports = React.createClass({

	displayName : 'ViewUsersList',

	mixins: [Sentry(), animation.Mixins.ScrollContainerToTop],

	statics: {
		navigationBar: 'main',
		getNavigation () {
			return {
				leftIcon: 'ion-android-menu',
				leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title: 'Utilisateurs'
			};
		}
	},

	getInitialState ()
	{
		this.userId = AuthStore.user().id;
		
		var friends = _friendStore.getFriends(this.userId);
		console.log(_friendStore.getFriends);

		return {
			friends : friends
		}
	},

	componentDidMount ()
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

		_friendStore.emitter.on('update:' + this.userId, this.getData);

	},

	getData ()
	{
		this.setState({friends : _friendStore.getFriends(this.userId), loading : false});
		console.log(this.state);
	},

	render () {
		return (
			<Container direction="column">
				<Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
					<UsersList users={this.state.friends} />
				</Container>
			</Container>
			)
	} 
});