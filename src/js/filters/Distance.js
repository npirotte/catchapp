export default function distance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a = 
     0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

  var distance = R * 2 * Math.asin(Math.sqrt(a)) * 1000;

  if (distance >= 1000) {
	    return (distance/1000).toFixed(2) + ' km';
	} else if(distance > 0) {
	    return distance.toFixed() + ' m';
	}
	else
	{
		return false;
	}
}