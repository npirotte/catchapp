var React = require('react/addons');
var Sentry = require('react-sentry');
var {
	//createApp,
	//Container,
	NavigationBar,
	Tabs,
	//ViewManager,
	//View
} = require('./touchstone');

var {
	createApp,
  View,
  ViewManager,
	Container,
	UI
} = require('touchstonejs');

var {Tabs} = UI;

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var AuthStore = require('./stores/AuthStore');

var device = require('./lib/device');

var imageUrl = require('./filters/ImageUrl');

var ItemAvatar = require('./components/ItemAvatar');

var App = React.createClass({
	mixins : [createApp(), Sentry()],

	/*childContextTypes: {
		dataStore: React.PropTypes.object
	},*/

	/*getChildContext () {
		return {
			dataStore: dataStore
		};
	},*/

	getInitialState : function () {
		return {
			defaultView : AuthStore.amRegistered() ? 'main' : 'login'
		}
	},

	componentDidMount : function () {
		// Delay the splash screen fade to allow for initial render to complete
		setTimeout(hideSplashScreen, 400);

		this.watch(document, 'backbutton', function (e) {
			e.preventDefault();
			return console.info('Do nothing by default; where applicable views have their own back button handler.');
		});

		this.watch(AuthStore.emitter, 'update', (event) => {
			this.setState({profile : AuthStore.user()});
		});
	},

	render : function () {
		var appWrapperClassName = 'app-wrapper device--' + device.platform;

		return (
			<div className={appWrapperClassName}>
				<div>
					<ViewManager ref="vm" name="app" defaultView={this.state.defaultView}>
						<View name="login" component={require('./views/auth/login')} />
						<View name="auth-register" component={require('./views/auth/Register')} />

						<View name="main" component={MainViewController} />
					</ViewManager>
				</div>
			</div>
		);
	}
});

var MainViewController = React.createClass({
	mixins : [Sentry()],

	componentDidMount : function () {
		this.watch(AuthStore.emitter, 'update', (event) => {
			this.setState({profile : AuthStore.user()});
		});
	},  

	getInitialState : function () {
		return {
			profile : AuthStore.user(),
		}
	},

	handleChange : function (view)
	{
		console.log(view);
		var body = document.getElementsByTagName('body')[0];

		body.classList.remove('android-menu-is-open');

		if (view !== 'logoff') {
			this.refs.viewManager.transitionTo(view, {});
		}
		else
		{
			AuthStore.logoff();
		}
	},

	render : function () {

		const defaultView = 'home';

		var src = this.state.profile.asset ? imageUrl(this.state.profile.asset, 200) : null,
			fullName = this.state.profile.fullName || (this.state.profile.firstName + ' ' + this.state.profile.lastName);

		return (
			<Container>


				<div className="Tabs-Navigator-wrapper">
				<Tabs.Navigator>
					<ItemAvatar src={src} losange="true" className="sm" name={fullName} />
					<Tabs.Tab value="home" onClick={this.handleChange.bind(this, 'home')}>
						<span className="Tabs-Icon Tabs-Icon--home" />
						<Tabs.Label>Acceuil</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab value="catchs-list" onTap={this.handleChange.bind(this, 'catchs-list')}>
						<span className="Tabs-Icon Tabs-Icon--catch" />
						<Tabs.Label>Goops</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab onClick={this.handleChange.bind(this, 'search')}>
						<span className="Tabs-Icon Tabs-Icon--search" />
						<Tabs.Label>Rechercher</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab value="users-list" onClick={this.handleChange.bind(this, 'users-list')}>
						<span className="Tabs-Icon Tabs-Icon--people" />
						<Tabs.Label>Utilisateurs</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab value="pending-friendships" onClick={this.handleChange.bind(this, 'pending-friendships')}>
						<span className="Tabs-Icon Tabs-Icon--request" />
						<Tabs.Label>Demandes d amis</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab value="auth-edit" onClick={this.handleChange.bind(this, 'auth-edit')}>
						<span className="Tabs-Icon Tabs-Icon--user" />
						<Tabs.Label>Editer profil</Tabs.Label>
					</Tabs.Tab>
					<Tabs.Tab className="Tab--logoff" value="logoff" onClick={this.handleChange.bind(this, 'logoff')}>
						<span className="Tabs-Icon Tabs-Icon--logoff" />
						<Tabs.Label>Déconnexion</Tabs.Label>
					</Tabs.Tab>
				</Tabs.Navigator>
				</div>
				<NavigationBar name="main" />
				<ViewManager name="main" ref="viewManager" defaultView={defaultView}>
					<View name="home" component={require('./views/Home')} />

					<View name="auth-edit" component={require('./views/auth/Edit')} />

					<View name="catchs-list" component={require('./views/catchs/List')} />
					<View name="catchs-details" component={require('./views/catchs/Details')} />
					<View name="catchs-form" component={require('./views/catchs/Form')} />
					<View name="catchs-gps" component={require('./views/catchs/GPS')} />

					<View name="users-list" component={require('./views/users/List')} />
					<View name="users-details" component={require('./views/users/Details')} />
					<View name="users-browser" component={require('./views/users/Browser')} />
					<View name="pending-friendships" component={require('./views/users/PendingFriendships')} />

					<View name="search" component={require('./views/users/Search')} />
				</ViewManager>
			</Container>
		);
	}
});

function hideSplashScreen () {
	try {
		navigator.splashscreen.hide();
	} catch(e) {}
}

function blockBodyTouchMove (e) {
	var currentTarget = e.target;
	while (currentTarget && currentTarget !== document.body) {
		if (currentTarget.scrollHeight > currentTarget.offsetHeight) {
			// we found a scrollable area; allow it.
			return;
		}
		currentTarget = currentTarget.parentNode;
	}
	// no scrollable parent elements; prevent the move.
	e.preventDefault();
}

function bindBlockBodyTouchMove () {
	window.addEventListener('touchmove', blockBodyTouchMove);
}

function unbindBlockBodyTouchMove () {
	window.removeEventListener('touchmove', blockBodyTouchMove);
}

var lastWindowHeight = 0;
var keyboardIsVisible = false;

function updateAppHeight(h) {
	if (typeof h === 'number') h = h + 'px';
	document.getElementById('app').style.height = h;
};

function fixWindowHeight () {
	var resetAppHeight = function() {
		if (keyboardIsVisible || window.innerHeight === lastWindowHeight) return;
		lastWindowHeight = window.innerHeight;
		updateAppHeight(lastWindowHeight);
		// if the iOS in-call status bar is visible, this fixes the scrolling
		// bug that's present on the document body.
		if (document.body.scrollHeight > window.innerHeight) {
			bindBlockBodyTouchMove();
		} else {
			unbindBlockBodyTouchMove();
		}
	}
	resetAppHeight();
	setInterval(resetAppHeight, 250);
}

function keyboardShowHandler(e) {
	keyboardIsVisible = true;
	delete document.getElementById('app').style.height;
    console.log('Keyboard height is: ' + e.keyboardHeight + ', window height is: ' + window.innerHeight + ', last window height is: ' + lastWindowHeight);
}

function keyboardHideHandler(e) {
	keyboardIsVisible = false;
	updateAppHeight(lastWindowHeight);
    console.log('Keyboard is hidden, window height is: ' + window.innerHeight + ', last window height is: ' + lastWindowHeight);
}


function startApp () {
	if (window.StatusBar) {
		window.StatusBar.styleLightContent();
	}
	fixWindowHeight();
	React.render(<App />, document.getElementById('app'));
}

// native? wait for deviceready
if (window.cordova) {
	window.addEventListener('native.keyboardshow', keyboardShowHandler);
	window.addEventListener('native.keyboardhide', keyboardHideHandler);
	document.addEventListener('deviceready', startApp, false);

// browser, start asap
} else {
	startApp();
}
