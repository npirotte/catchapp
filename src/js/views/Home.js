var Sentry = require('react-sentry');
var React = require('react');

var { Link, Container, } = require('touchstonejs');

var imageUrl = require('../filters/ImageUrl');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var AuthStore = require('../stores/AuthStore');

var ItemAvatar = require('../components/ItemAvatar');

export default React.createClass({

	displayName : 'ViewHome',

	mixins : [Sentry()],

	statics : {
		navigationBar : 'main',
		getNavigation : function () {
			return {
				leftIcon : 'ion-android-menu',
				leftAction : emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title : 'Goopy'
			};
		}
	},

	getInitialState : function ()
	{
		return {
			profile : AuthStore.user(),
			isOnline : window.navigator.onLine
		};
	},

	componentDidMount : function ()
	{
		var body = document.getElementsByTagName('body')[0];

		this.watch(emitter, 'navigationBarLeftAction', function()
		{
			body.classList.toggle('android-menu-is-open');
		});

		this.watch(AuthStore.emitter, 'update', (event) => {
			this.setState({profile : AuthStore.user()});
		});

	},

	render : function ()
	{
		var src = this.state.profile.asset ? imageUrl(this.state.profile.asset, 200) : null,
			fullName = this.state.profile.fullName || (this.state.profile.firstName + ' ' + this.state.profile.lastName),
			onlineClassName = 'online-statut online-statut--' + (this.state.isOnline ? 'online' : 'offline');

		return (
			<Container direction="column" className="AuthLogin">
				<Container justify align="center" direction="column">
					<div>
						<ItemAvatar losange="true" color="" className="center margin" name={fullName} src={src}></ItemAvatar>

						<div className={onlineClassName}>{this.state.isOnline ? 'online' : 'offline'}</div>
						<br/>
						<div>
							<h1> Bienvenue {this.state.profile.fullName} ! </h1>
						</div>
						<br/>
						<div>
							<Link className="button button-primary button--raised"  to="main:catchs-form" viewProps={{previousView : 'main:home'}} transition="show-from-right" component="button">
								Envoyer un Goop
							</Link>
						</div>
					</div>
				</Container>
			</Container>
		);
	}
});
