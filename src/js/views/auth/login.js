var animation = require('../../touchstone/animation');
var {LabelInput, Link, Transitions} = require('../../touchstone');
var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');
var { animation, Transitions, Link } = require('../../touchstone');

var AuthStore = require('../../stores/AuthStore');

module.exports = React.createClass({
	displayName : 'ViewLogin',

	mixins: [Sentry(), Transitions],

	getInitialState ()
	{
		return {
			error : ''
		}
	},

	render ()
	{
		return (
			<Container direction="column" className="AuthLogin">
				<Container justify align="center" direction="column">
					<div>
						<form onSubmit={this.handleFormSubmission}>
							{this.renderError()}
							<div>
								<LabelInput ref="username" name="username" type="text" placeholder="Email" label="Email"  required={true} />
								<LabelInput ref="password" name="password" type="password" placeholder="Mot de passe" label="Mot de passe" required={true} />
							</div>
							<br />
							<Tappable onTap={this.handleFormSubmission} type="submit" className="button button--raised">Connexion</Tappable>
						</form>		
						<br />
						<Link to="app:auth-register" viewProps={{}}  transition="show-from-right" component="a" className="button">
							Créer un compte
						</Link>
					</div>
				</Container>
			</Container>
			)
	},

	renderError ()
	{
		if(!this.state.error) return false;

		return (
			<div className="error-message">
				{this.state.error}
			</div>
			)
	},

	handleFormSubmission (event)
	{
		var self = this;

		event.preventDefault();

		var data = {
			username : this.refs['username'].getDOMNode().querySelector('input').value,
			password : this.refs['password'].getDOMNode().querySelector('input').value
		}

		// validation
		if (!data.username || !data.password) {
			this.setState({error : 'Vous devez remplir tous les champs'});
			return false;
		};

		AuthStore.login(data, function(err, res)
		{
			if (err) return false;

			self.transitionTo('app:main:catchs-list', {
				transition: 'show-from-right',
				viewProps: {}
			});
		});
	}
})