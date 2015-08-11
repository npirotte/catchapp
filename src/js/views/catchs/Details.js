var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');
var { animation, Transitions } = require('../../touchstone');

var ImageUrl = require('../../filters/ImageUrl');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var CatchsStore = require('../../stores/CatchsStore');

const scrollable = Container.initScrollable();

function getNavigation(props)
{
	return {
		leftArrow: true,
		title: 'Goop de ' + props.catchItem.sender.fullName,
		leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction')
	}
}

module.exports = React.createClass({

	mixins: [Sentry(), Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

	displayName : 'ViewCatchsDetails',

	render () {

		var catchImageUrl = ImageUrl(this.props.catchItem.asset, 960),
			imageStyle = { width : '100%' };
		
		return (
			<Container>
				<img src={catchImageUrl} style={imageStyle} />
				{this.props.catchItem.sender.fullName}
			</Container>
			)
	},

	componentDidMount() {

		this.watch(emitter, 'navigationBarLeftAction', event => {
			this.transitionTo('main:catchs-list', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});

		// android backbutton handler
		this.watch(document, 'backbutton', event => {
			self.transitionTo('main:catchs-list', {
				transition: 'reveal-from-right',
				viewProps: {}
			});
		});
	}
});