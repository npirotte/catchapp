import React from 'react';
import Sentry from 'react-sentry';
import Container from 'react-container';
import Tappable from 'react-tappable';
import GMaps from 'gmaps';
import { Transitions } from '../../touchstone';

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var myPositionCache;

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

function getTravel(context, mapElm, target)
{
  var path =  "M13.143,6.571c0,0.933-0.141,1.699-0.423,2.298l-4.672,9.934c-0.137,0.282-0.34,0.505-0.61,0.667s-0.558,0.244-0.866,0.244 s-0.597-0.081-0.867-0.244s-0.468-0.385-0.597-0.667L0.424,8.869C0.141,8.27,0,7.504,0,6.571c0-1.814,0.642-3.363,1.925-4.646 C3.209,0.642,4.757,0,6.572,0c1.813,0,3.363,0.642,4.646,1.925C12.501,3.208,13.143,4.757,13.143,6.571z M8.895,8.895 c0.642-0.642,0.963-1.416,0.963-2.323c0-0.907-0.321-1.681-0.963-2.323C8.253,3.606,7.479,3.286,6.572,3.286 c-0.907,0-1.682,0.321-2.323,0.963C3.607,4.89,3.286,5.665,3.286,6.571c0,0.907,0.321,1.682,0.963,2.323 C4.89,9.537,5.665,9.857,6.572,9.857C7.479,9.857,8.253,9.537,8.895,8.895z";

  var iconMarkerStart = {
      path: path,
      fillColor: "#00E676",
      fillOpacity: 0.9,
      anchor: new google.maps.Point(7,19),
      strokeWeight: 0,
      scale: 2
  }

  var iconMarkerEnd = {
      path: path,
      fillColor: "#FF1744",
      fillOpacity: 0.9,
      anchor: new google.maps.Point(7,19),
      strokeWeight: 0,
      scale: 2
  }

	var map = new GMaps({
		div: mapElm,
		lat: myPositionCache.coords.latitude,
		lng: myPositionCache.coords.longitude,
    styles:[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
	});

  map.addMarker({
    lat: myPositionCache.coords.latitude,
		lng: myPositionCache.coords.longitude,
    icon: iconMarkerStart
  });

  map.addMarker({
    lat: target[0],
    lng: target[1],
    icon: iconMarkerEnd
  });

	map.travelRoute({
	  origin: [myPositionCache.coords.latitude, myPositionCache.coords.longitude],
	  destination: target,
	  travelMode: 'walking',
	  end : function(e)
	  {

      e.legs[0].steps.forEach(step => {
        map.drawPolyline({
          path : step.path,
          strokeColor: '#90A4AE',
          strokeOpacity: 1,
          strokeWeight: 4
        })
      });

      map.fitBounds(e.bounds);
	  	/*$scope.$apply(function(){
	  		$scope.duration = e.legs[0].duration.text;
	  		$scope.distance = e.legs[0].distance.text;
	  		$scope.steps = e.legs[0].steps;
	  	});*/
      context.setState({
        steps : e.legs[0].steps,
        duration : e.legs[0].duration.text,
        distance : e.legs[0].distance.text
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

  displayName : 'CatchGps',

  mixins: [Sentry(), Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation : getNavigation
	},

  getInitialState() {
    var steps = [];
    if(this.props.routeData && this.props.routeData.legs[0].steps)
    {
      steps = this.props.routeData.legs[0].steps;
    }
    return { steps : steps }
  },

  componentDidMount() {

    this.refresh();

    this.watch(emitter, 'navigationBarLeftAction', event => {
			this.transitionTo('main:catchs-details', {
				transition: 'reveal-from-right',
				viewProps: this.props.previousViewProps
			});
		});

		// android backbutton handler
		this.watch(document, 'backbutton', event => {
			self.transitionTo('main:catchs-details', {
        transition: 'reveal-from-right',
				viewProps: this.props.previousViewProps
			});
		});
  },

  refresh() {
    navigator.geolocation.getCurrentPosition( (position) => {
			myPositionCache = position;
			getTravel(this, this.refs.gMap.getDOMNode(), this.props.catchItem.geo)
		});
  },

  render() {

    const mapStyle = {
      height : screen.width * 0.66
    };

    return (
      <Container className="catch-details" direction="column">
        <div ref="gMap" style={mapStyle} />
        <Container className="margin-top" fill scrollable={getScrollable(this.props.catchItem.id)} ref="scrollContainer">
          <div>
            <div className="padding">
              <h2><i className="ion-android-walk text-primary"></i> - {this.state.duration}</h2>
              <hr/>
            </div>
            <div className="List">
              {this.state.steps.map((step, index) => {
                return (
                  <div className="ListItem" key={index}>
                    <span dangerouslySetInnerHTML={{__html : step.instructions}}/>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
        <div className="Footer Footer--cta">
					<Tappable className="button button-primary" onTap={this.refresh}>
					  Recalculer
					</Tappable>
				</div>
      </Container>
    )
  }

});
