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
	var map = new GMaps({
		div: mapElm,
		lat: myPositionCache.coords.latitude,
		lng: myPositionCache.coords.longitude
	});

  map.addMarker({
    lat: myPositionCache.coords.latitude,
		lng: myPositionCache.coords.longitude
  });

  map.addMarker({
    lat: target[0],
    lng: target[1]
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
          strokeColor: '#131540',
          strokeOpacity: 0.6,
          strokeWeight: 6
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
