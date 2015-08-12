var animation = require('../../touchstone/animation');
var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');
var async = require('async');
var {LabelTextarea, Transitions, Link} = require('../../touchstone');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var AuthStore = require('../../stores/AuthStore');
var FriendsStore = require('../../stores/FriendsStore'),
	_friendStore = new FriendsStore();

var Toaster = require('../../lib/Toaster');
var AssetService = require('../../lib/AssetService');

var CatchsStore = require('../../stores/CatchsStore');

const scrollable = Container.initScrollable();

const defaultData = {
	formData : {
		recipents : []
	},
	picture: null
};

var dataStore;

function cleanDataStore()
{
	dataStore = JSON.parse(JSON.stringify(defaultData));
}

cleanDataStore();

function getNavigation(props)
{
	return {
		leftArrow: true,
		title: 'Nouveau Goop',
		leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
	}
}

module.exports = React.createClass({

	displayName : 'ViewCatchForm',

	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

	mixins: [Sentry(), Transitions, animation.Mixins.ScrollContainerToTop],

	getInitialState() {

		if (this.props.recipents) {
			dataStore.formData.recipents = this.props.recipents;
		}

		this.userId = AuthStore.user().id;
		this.friendsData = _friendStore.getManyByIds(this.userId, dataStore.formData.recipents);

		return dataStore;
	},

	componentDidMount() {
		var _this = this;

		if (navigator.camera && !this.state.picture) {
			navigator.camera.getPicture( function(imageData) {
				_this.setState({picture : imageData});
				dataStore = _this.state;
			}, function() {}, {targetWidth: 1024, targetHeight: 1024});
		}

		if (navigator.geolocation && !this.state.formData.geo) {
			navigator.geolocation.getCurrentPosition( function(position) {
				_this.state.formData.geo = [position.coords.latitude, position.coords.longitude];
				_this.setState({formData : _this.state.formData });
				dataStore = _this.state;
			});
		}

		var gotoView = this.props.previousView || 'main:catchs-list',
			backViewProps = this.props.previousViewProps || {}

		emitter.once('navigationBarLeftAction', (event) => {
			cleanDataStore();
			_this.transitionTo(gotoView, { viewProps : backViewProps })
		});
	},

	render() {
		//console.log(this.state.formData.recipents);
		// get recipents model

		return (
			<Container direction="column">
				<Container fill scrollable={scrollable} onScroll={this.handleScroll} ref="scrollContainer">
					<form>
						<img src={this.state.picture} style={{ width : '100%' }} />
						<LabelTextarea 
							label="Message" 
							first={true} 
							name="message" 
							ref="message" 
							value={this.state.formData.message} 
							onChange={this.handleFormChange} />

						<div>
							{this.state.formData.recipents.map(function(userItem, index)
							{
								var friend = this.friendsData[userItem]
								return (
									<Tappable onTap={this.deleteUser.bind(this, userItem, friend)} className="ListItem">{friend.fullName}</Tappable>
									);
							}.bind(this))}
						</div>
						<div>
							<Link to="main:users-browser" viewProps={{selectedFriends : this.state.formData.recipents}} transition="show-from-bottom" className="button">
								Ajouter des amis
							</Link>
						</div>
						<br />
						<div>
							<Tappable onTap={this.handleFormSubmit} className="button button--raised">
								Envoyer
							</Tappable>
						</div>
					</form>
				</Container>
			</Container>
			)
	},

	deleteUser(userId, userModel)
	{
		if(confirm('Supprimer ' + userModel.fullName + ' de la liste d\'envoi ?')){
			console.log(userId);
			this.state.formData.recipents = this.state.formData.recipents.filter((user) => {
				return user != userId;
			});
			dataStore = this.state;
			this.setState(dataStore);
		}
	},

	handleFormChange(event) {
		// update state
		this.state.formData[event.target.name] = event.target.value;
		dataStore = this.state;
		/*async.nextTick(() => 
		{
			this.setState({ formData : this.state.formData });
		});*/
		
	},

	handleFormSubmit(event) {
		var data = this.state.formData;
		var _this = this;

		if (this.state.picture) {

			AssetService(this.state.picture, function(err, res)
			{
				if(err) return false;

				console.log(res);
				data.asset = res.asset.id;

				CatchsStore.sendCatch(data, function(err, res) {
					console.log(err, res);
					if (err) return false;

					cleanDataStore();

					async.nextTick(() => {
						Toaster({
							message : 'Catch envoyé !'
						});
					})

					_this.transitionTo('main:catchs-list');
				});

			});

		} else {
			CatchsStore.sendCatch(data, function(err, res) {
				console.log(err, res);
				if (err) return false;

				cleanDataStore();

				async.nextTick(() => {
					Toaster({
						message : 'Catch envoyé !'
					});
				})

				_this.transitionTo('main:catchs-list');
			});
		}
	}
})