var React = require('react');
var Container = require('react-container');
var Sentry = require('react-sentry');
var {LabelInput, Link, Transitions} = require('../../touchstone');

var {emailValidation} = require('../../lib/FormValidations');

var AuthStore = require('../../stores/AuthStore');

var AssetService = require('../../lib/AssetService');

const scrollable = Container.initScrollable();

export default React.createClass({

	displayName : 'ViewAuthRegister',

	mixins : [Transitions, Sentry()],

	getInitialState()
	{
		return {
			errors : [],
			viewState : 'form',
			picture : null
		}
	},

	componentDidMount()
	{
		// android backbutton handler
		this.watch(document, 'backbutton', () => {
			this.transitionTo('app:login', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});
	},

	render()
	{
		return (
			<Container direction="column">
				<Container fill scrollable={scrollable} ref="scrollContainer">
					<div className="padding">
						<h1>Création d un compte</h1>
						{this.renderErrors()}
						{this.renderForm()}
						{this.renderImagePicker()}
						<div className="text-center">
							<Link to="app:login"  className="button button-return" viewProps={{}}  transition="reveal-from-right" component="a">
								Retour
							</Link>
						</div>
					</div>
				</Container>
			</Container>
			)
	},

	renderForm()
	{
		if (this.state.viewState !== 'form') return false;

		return (
			<form onSubmit={this.handleFormSubmission}>
				<LabelInput ref="lastName" name="lastName" placeholder="Nom" label="Nom" required={true} first={true} />
				<LabelInput ref="firstName" name="firstName" placeholder="Prénom"  label="Prénom"  required={true}/>
				<LabelInput ref="username" name="username" placeholder="Email" label="Email" type="email"  required={true}/>
				<LabelInput ref="password" name="password" placeholder="Mot de passe" label="Mot de passe" type="password" required={true}/>
				<LabelInput ref="passwordConfirm" name="password-confirm" placeholder="Confirmer" label="Confirmer" type="password" required={true}/>
				<div className="text-center">
					<button className="button button-primary">
						Suite
					</button>
				</div>
			</form>
			)
	},

	renderImagePicker()
	{
		if (this.state.viewState !== 'image-picker') return false;

		var src = this.state.picture || './img/no-image.png',
			style = { width : '100%' };

		return (
			<div className="text-center">
				<img src={src} style={style} />
				
				<button className="button button-primary-light" onClick={this.pickPhoto}>
					Prendre une photo de profil
				</button>
				
				<button className="button button-primary" onClick={this.register}>
					Créer un compte
				</button>
			</div>
			)
	},

	renderErrors()
	{
		console.log(this.state.errors.length);
		if (!this.state.errors.length) return false;

		return (
			<ul className="errors-message">
				{this.state.errors.map(function(error){
					return (
						<li key={error.key}>
							{error.text}
						</li>
						)
				})}
			</ul>
			)
	},

	pickPhoto()
	{
		var _this = this;
		if (navigator.camera && !this.state.picture) {
			navigator.camera.getPicture( function(imageData) {
				_this.setState({picture : imageData});
			}, function() {}, {targetWidth: 1024, targetHeight: 1024});
		}
	},

	handleFormSubmission(event)
	{
		event.preventDefault();

		this.state.errors = [];

		var formData = {
				lastName :  this.refs.lastName.getDOMNode().querySelector('input').value,
				firstName :  this.refs.firstName.getDOMNode().querySelector('input').value,
				username : this.refs.username.getDOMNode().querySelector('input').value,
				password : this.refs.password.getDOMNode().querySelector('input').value
			},
			passwordConfirm = this.refs.passwordConfirm.getDOMNode().querySelector('input').value;

		// required fields

		var requiredPass = true;

		for(var k in formData)
		{
			console.log(formData);
			if (!formData[k]) {
				this.state.errors.push({ text : 'le champ ' + k + ' est requis', key : k});
				requiredPass = false;
			};
		}

		if (!requiredPass) {
			this.setState({errors : this.state.errors});
			return false;
		};

		// email format

		if (!emailValidation(formData.username)) {
			this.state.errors.push({ text : 'Le champ email doit être un email', key : 'username'})
			this.setState({errors : this.state.errors});
			return false;
		};


		// password match

		if (formData.password !== passwordConfirm) {
			console.log('password do not match');
			this.setState({errors : [{ text : 'Les mots de passe doivent être identiques', key : 'passwordConfirm'}]});
			return false;
		};

		AuthStore.saveRegistration(formData);

		this.state.viewState = 'image-picker';

		this.setState(this.state);

		return false;
	},

	register()
	{
		var _this = this;

		AuthStore.register(function(err, data)
			{
				if (err)
				{
					_this.state.errors.push({text : 'Erreur lors de la création du profil', key : 'server'});
					_this.setState({errors : _this.state.errors});
					return false;
				}

				// upload de l'image

				if (_this.state.picture) {
					AssetService(_this.state.picture, function(err, res)
					{
						if(err) return false;

						data.asset = res.asset.id;

						AuthStore.update(data);

						_this.transitionTo('app:main');
						
					});	
				}
				else
				{
					_this.transitionTo('app:main');
				}
			});
	}
});