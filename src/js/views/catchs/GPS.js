import React from 'react';
import Container from 'react-container';
import GMaps from 'gmaps';

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
        steps : e.legs.steps,
        duration : e.legs[0].duration.text,
        distance : e.legs[0].distance.text
      })
	  }
	});

  return map;
}

export default React.createClass({

  displayName : 'CatchGps',

  getInitialState() {
    return { steps : [] }
  },

  componentDidMount() {

    navigator.geolocation.getCurrentPosition((position) => {
			myPositionCache = position;
			//_this.setState({myPosition : position})
      getTravel(this, this.refs.gMap.getDOMNode(), this.props.catchItem.geo);
		});

  },

  render() {

    const mapStyle = {
      height : screen.width * 0.66
    };

    return (
      <Container scrollable={getScrollable('0')}>
        {this.state.duration}
        <div ref="gMap" style={mapStyle} />
        Gps
      </Container>
    )
  }

});
