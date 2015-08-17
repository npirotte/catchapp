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
var scrollables = new Map();

function getScrollable(catchId)
{
	var scrollable = scrollables.get(catchId);
	if (!scrollable) {
		scrollable = Container.initScrollable();
		scrollables.set(catchId, scrollable);
	};

	return scrollable;
}

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

		if (this.state.myPosition && this.props.catchItem) {
			distance = Distance(this.state.myPosition.coords.latitude, this.state.myPosition.coords.longitude, this.props.catchItem.geo[0], this.props.catchItem.geo[1]);
		} else {
			distance = "Inconnu";
		}

		return (
			<Container className="catch-details" direction="column">
				<Container fill scrollable={getScrollable(this.props.catchItem.id)} ref="scrollContainer">
					<div>
						<div className="catch-details__cover">
							<CoverImage src={catchImageUrl} title={this.props.catchItem.message} />
						</div>
						<div className="catch-details__sender ListItem ListItem--separated">
							<ItemAvatar className="ListItem__avatar--small" src={userThumbUrl} name={this.props.catchItem.sender.fullName} />
							<div className="ListItem__content">
								<strong>{this.props.catchItem.sender.fullName}</strong>
							</div>
						</div>
						<div className="catch-details__infos list">
							<div className="ListItem ListItem--small">
								<i className="ListItem__icon icon ion-android-time" />
								<div className="ListItem__content">
									{fromNow}
								</div>
							</div>
							<div className="ListItem-separator--partial" />
							<div className="ListItem ListItem--small">
								<i className="ListItem__icon icon ion-ios-location" />
								<div className="ListItem__content">
									{distance}
								</div>
							</div>
							<div className="ListItem-separator--partial" />
							<div className="ListItem ListItem--small">
								<i className="ListItem__icon icon ion-speakerphone" />
								<div className="ListItem__content">
									{this.props.catchItem.message || 'Aucun message associé'}
								</div>
							</div>
						</div>
					</div>
				</Container>
				<div className="Footer Footer--cta">
					<Tappable className="button button-primary">
						Y aller
					</Tappable>
				</div>
			</Container>
			)
	}
});