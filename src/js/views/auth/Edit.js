var React = require('react');
var Container = require('react-container');
var Sentry = require('react-sentry');
var {LabelInput, Link, Transitions} = require('../../touchstone');
var Tappable = require('react-tappable');

var ImageUrl = require('../../filters/ImageUrl');

var AuthStore = require('../../stores/AuthStore');

var AssetService = require('../../lib/AssetService');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

const scrollable = Container.initScrollable();

function getNavigation()
{
	return {
		leftArrow: true,
		leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
		title: 'Editer mon profil'
	};
}

export default React.createClass({
	
	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

	mixins : [Sentry(), Transitions],

	getInitialState ()
	{
		return {
			user : AuthStore.user(),
			picture : null,
			errors : []
		}
	},

	componentDidMount ()
	{
		this.watch(emitter, 'navigationBarLeftAction', (event) => {
			this.transitionTo('main:home', { transition: 'reveal-from-right' });
		});
	},

	render ()
	{
		var src = this.state.picture || ImageUrl(this.state.user.asset);

		return (
			<Container>
				<Tappable onTap={this.pickImage}>
					<img src={src} style={{width : "20%"}} />
				</Tappable>
				{this.renderErrors()}
				<form onSubmit={this.handleFormSubmission}>
					<LabelInput ref="lastName" label="Nom" defaultValue={this.state.user.lastName} />
					<LabelInput ref="firstName" label="Prénom" defaultValue={this.state.user.firstName} />
					<LabelInput ref="username" label="Email" value={this.state.user.username} readOnly={true} />
					<br />
					<button>
						Enregister
					</button>
				</form>
			</Container>
			)
	},

	pickImage (event)
	{
		var _this = this;
		if (navigator.camera && !this.state.picture) {
			navigator.camera.getPicture( function(imageData) {
				_this.setState({picture : imageData});
			}, function() {}, {targetWidth: 1024, targetHeight: 1024});
		}
	},

	renderErrors()
	{
		console.log(this.state.errors.length);
		if (!this.state.errors.length) return false;

		return (
			<ul className="errors">
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

	handleFormSubmission (event)
	{
		event.preventDefault();

		var formData = {
				lastName :  this.refs.lastName.getDOMNode().querySelector('input').value,
				firstName :  this.refs.firstName.getDOMNode().querySelector('input').value
				//username : this.refs.username.getDOMNode().querySelector('input').value,
				//password : this.refs.password.getDOMNode().querySelector('input').value
			};

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

		if (!this.state.picture) {
			this.doUpdate(formData);
		} 
		else
		{
			AssetService(this.state.picture, (err, res) =>
			{
				if(err) return false;

				formData.asset = res.asset.id;

				this.doUpdate(formData);
				
			});	
		}
	},

	doUpdate (formData)
	{
		AuthStore.update(formData, (err, data) =>
		{
			console.log(err, data);
			if (err) return false;

			this.transitionTo('main:home', { transition: 'reveal-from-right' });
		})
	}
});