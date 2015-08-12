var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var moment = require('moment');
var Tappable = require('react-tappable');
var { animation, Transitions } = require('../../touchstone');

var ImageUrl = require('../../filters/ImageUrl');
var Distance = require('../../filters/Distance');

var ItemAvatar = require('../../components/ItemAvatar');
var CoverImage = require('../../components/CoverImage');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var CatchsStore = require('../../stores/CatchsStore');

const scrollable = Container.initScrollable();

var myPositionCache;

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

	getInitialState()
	{
		return {
			myPosition : null
		}
	},

	componentDidMount() {

		var _this = this;

		navigator.geolocation.getCurrentPosition( function(position) {
			myPositionCache = position;
			_this.setState({myPosition : position})
		});

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
	},

	render () {

		var catchImageUrl = ImageUrl(this.props.catchItem.asset, 960),
			imageStyle = { width : '100%' };

		var userThumbUrl = this.props.catchItem.sender.asset ? ImageUrl(this.props.catchItem.sender.asset) : null;

		var fromNow = moment(this.props.catchItem.createdAt).fromNow();
		var distance;

		if (this.state.myPosition) {
			distance = Distance(this.state.myPosition.coords.latitude, this.state.myPosition.coords.longitude, this.props.catchItem.geo[0], this.props.catchItem.geo[1]);
		};

		console.log(distance);

		return (
			<Container className="catch-details">
				<div className="catch-details__cover">
					<CoverImage src={catchImageUrl} title={this.props.catchItem.message} />
				</div>
				<div className="catch-details__sender">
					<ItemAvatar src={userThumbUrl} name={this.props.catchItem.sender.fullName} /> {this.props.catchItem.sender.fullName}
				</div>
				<div className="catch-details__infos">
					<div>
						{fromNow}
					</div>
					<div>
						{distance}
					</div>
					<div>
						{this.props.catchItem.message}
					</div>
				</div>
			</Container>
			)
	}
});