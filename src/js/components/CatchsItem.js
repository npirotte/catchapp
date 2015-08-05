var React = require('react');
var moment = require('moment');
var { Link } = require('../touchstone');

var ItemAvatar = require('./ItemAvatar');

var ImageUrl = require('../filters/ImageUrl');
var Distance = require('../filters/Distance');

module.exports = React.createClass({

	distance : false,

	render()
	{
		var imageUrl = this.props.catchItem.sender.asset ? ImageUrl(this.props.catchItem.sender.asset) : null;
		var fromNow = moment(this.props.catchItem.createdAt).fromNow();
		var distance;

		if (this.props.myPosition && !this.distance) {
			this.distance = Distance(this.props.myPosition.coords.latitude, this.props.myPosition.coords.longitude, this.props.catchItem.geo[0], this.props.catchItem.geo[1]);
		};

		console.log(this.props);
		
		return (
			<Link to="main:catchs-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				<ItemAvatar src={imageUrl} name={this.props.catchItem.sender.fullName} />
				<div className="ListItem__content">
					<div className="ListItem__heading">
						{this.props.catchItem.sender.fullName}
					</div>
					<div className="ListItem__text">{fromNow} {this.distance}</div>
				</div>
				<div className="ListItem__chevron" />
			</Link>
			)
	}
})