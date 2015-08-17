var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var moment = require('moment');
var Tappable = require('react-tappable');
import { animation, Transitions, Link } from '../../touchstone';
import GMaps from 'gmaps';

var ImageUrl = require('../../filters/ImageUrl');
var Distance = require('../../filters/Distance');

var ItemAvatar = require('../../components/ItemAvatar');
var CoverImage = require('../../components/CoverImage');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var CatchsStore = require('../../stores/CatchsStore');

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

function getTravel(context, mapElm, target)
{
	var map = new GMaps({
		div: mapElm,
		lat: myPositionCache.coords.latitude,
		lng: myPositionCache.coords.longitude
	});

	map.travelRoute({
	  origin: [myPositionCache.coords.latitude, myPositionCache.coords.longitude],
	  destination: target,
	  travelMode: 'walking',
	  end : function(e)
	  {
	  	console.log(e);
	  	/*$scope.$apply(function(){
	  		$scope.duration = e.legs[0].duration.text;
	  		$scope.distance = e.legs[0].distance.text;
	  		$scope.steps = e.legs[0].steps;
	  	});*/
      context.setState({
        duration : e.legs[0].duration.text,
        distance : e.legs[0].distance.text,
				location : e.legs[0].end_address
      })
	  }
	});

  return map;
}

function getNavigation(props)
{
	return {
		leftArrow: true,
		title: 'Goop de ' + props.catchItem.sender.fullName,
		leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction')
	}
}

export default React.createClass({

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

		if (myPositionCache) {
			getTravel(this, this.refs.gMaps.getDOMNode(), this.props.catchItem.geo);
		}

		navigator.geolocation.getCurrentPosition( (position) => {
			myPositionCache = position;
			_this.setState({myPosition : position});
			getTravel(this, this.refs.gMaps.getDOMNode(), this.props.catchItem.geo);
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

		return (
			<Container className="catch-details" direction="column">
				<Container fill scrollable={getScrollable(this.props.catchItem.id)} ref="scrollContainer">
					<div>
						<div className="catch-details__cover">
							<CoverImage src={catchImageUrl} title={this.props.catchItem.message} />
						</div>
						<Link
							to="main:users-details"
							viewProps={{previousView : 'main:catchs-details', previousViewProps: this.props, userItem : this.props.catchItem.sender}}
							transition="show-from-right"
							className="catch-details__sender ListItem ListItem--separated"
						>
							<ItemAvatar className="ListItem__avatar--small" src={userThumbUrl} name={this.props.catchItem.sender.fullName} />
							<div className="ListItem__content">
								<strong>{this.props.catchItem.sender.fullName}</strong>
							</div>
						</Link>
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
									{this.state.location}
								</div>
							</div>
							<div className="ListItem-separator--partial" />
							<div className="ListItem ListItem--small">
								<i className="ListItem__icon icon ion-android-walk" />
								<div className="ListItem__content">
									{this.state.distance}, {this.state.duration}
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
					<Link className="button button-primary" to="main:catchs-gps" viewProps={{catchItem : this.props.catchItem, previousViewProps : this.props}}>
						Y aller
					</Link>
				</div>
				<div ref="gMaps" />
			</Container>
			)
	}
});
