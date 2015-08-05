var React = require('react');
var moment = require('moment');
var { Link } = require('../touchstone');

var ItemAvatar = require('./ItemAvatar');

var ImageUrl = require('../filters/ImageUrl');

module.exports = React.createClass({
	render()
	{
		var imageUrl = ImageUrl(this.props.catchItem.sender.asset);
		var fromNow = moment(this.props.catchItem.createdAt).fromNow();
		
		return (
			<Link to="main:catchs-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				<ItemAvatar src={imageUrl} name={this.props.catchItem.sender.fullName} />
				<div className="ListItem__content">
					<div className="ListItem__heading">
						{this.props.catchItem.sender.fullName}
					</div>
					<div className="ListItem__text">{fromNow}</div>
				</div>
				<div className="ListItem__chevron" />
			</Link>
			)
	}
})