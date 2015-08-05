var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var { animation, Transitions } = require('../../touchstone');

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

	mixins: [Sentry(), Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

	render() {
		var userImageUrl = ImageUrl(this.props.userItem.asset),
			imageStyle = { width : '100%' };

		return (
			<Container>
				<img src={userImageUrl} style={imageStyle} />
				{this.props.userItem.fullName}
			</Container>
			)
	},

	componentDidMount() {

		this.watch(emitter, 'navigationBarLeftAction', event => {
			this.transitionTo('main:users-list', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});

		// android backbutton handler
		this.watch(document, 'backbutton', function () {
			self.transitionTo('main:users-list', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});

		emitter.once('createNewCatch', event => {
			var props = {
				recipents : [this.props.userItem],
				previousViewProps : this.props,
				previousView : 'main:users-details'
			}
			this.transitionTo('main:catchs-form', { viewProps : props, });
		});
	}

})
