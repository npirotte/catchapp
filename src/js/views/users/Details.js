var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var { animation, Mixins, UI } = require('touchstonejs');

var ImageUrl = require('../../filters/ImageUrl');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

const scrollable = Container.initScrollable();

function getNavigation(props)
{
	return {
		leftArrow: true,
		title: props.userItem.fullName,
		leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
		rightIcon: 'ion-plus',
		rightAction : emitter.emit.bind(emitter, 'createNewCatch'),
	}
}

module.exports = React.createClass({

	displayName : 'ViewUserDetails',

	mixins: [Sentry(), Mixins.Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

	render : function() {
		var userImageUrl = ImageUrl(this.props.userItem.asset),
			imageStyle = { width : '100%' };

		return (
			<Container>
				<img src={userImageUrl} style={imageStyle} />
				{this.props.userItem.fullName}
			</Container>
			)
	},

	componentDidMount : function() {

		var previousView = this.props.previousView || 'main:users-list',
				previousViewProps = this.props.previousViewProps || {};

		this.watch(emitter, 'navigationBarLeftAction', event => {
			this.transitionTo(previousView, {
				transition : 'reveal-from-right',
				viewProps : previousViewProps
			});
		});

		// android backbutton handler
		this.watch(document, 'backbutton', event => {
			this.transitionTo(previousView, {
				transition : 'reveal-from-right',
				viewProps : previousViewProps
			});
		});

		emitter.once('createNewCatch', event => {
			var props = {
				recipents : [this.props.userItem.id],
				previousViewProps : this.props,
				previousView : 'main:users-details'
			}
			this.transitionTo('main:catchs-form', { viewProps : props });
		});
	}

})
