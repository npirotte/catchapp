var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');

var { Link } = require('../touchstone');

var ImageUrl = require('../filters/ImageUrl');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var AuthStore = require('../stores/AuthStore');

export default React.createClass({

	displayName : 'ViewHome',

	mixins : [Sentry()],

	statics: {
		navigationBar: 'main',
		getNavigation () {
			return {
				leftIcon: 'ion-android-menu',
				leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				title: 'Goopy'
			};
		}
	},

	getInitialState()
	{
		return {
			profile : AuthStore.user(),
			isOnline : window.navigator.onLine
		}
	},

	componentDidMount()
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

	render() 
	{
		var src = ImageUrl(this.state.profile.asset, 200),
			onlineClassName = 'online-statut online-statut--' + (this.state.isOnline ? 'online' : 'offline');

		return (
			<Container direction="column" className="AuthLogin">
				<Container justify align="center" direction="column">
					<div>
						<img src={src} style={{width : '100%'}} />
						<div className={onlineClassName}>{this.state.isOnline ? 'online' : 'offline'}</div>
						<div>
							Bienvenue {this.state.profile.fullName} !
						</div>
						<div>
							<Link to="main:catchs-form" viewProps={{previousView : 'main:home'}} transition="show-from-right" component="button" className="panel-button primary">
								Envoyer un Goop
							</Link>
						</div>
					</div>
				</Container>
			</Container>
			)
	}
})