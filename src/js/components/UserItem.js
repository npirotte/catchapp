var React = require('react');
var { Link } = require('../touchstone');

var ItemAvatar = require('./ItemAvatar');

var ImageUrl = require('../filters/ImageUrl');

module.exports = React.createClass({
	render()
	{
		var imageUrl = this.props.userItem.asset ? ImageUrl(this.props.userItem.asset, 180) : null;
		var fullName = this.props.userItem.fullName || (this.props.userItem.firstName + ' ' + this.props.userItem.lastName);

		return (
			<Link to="main:users-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				<ItemAvatar src={imageUrl} name={fullName} />
				<div className="ListItem__content">
					<div className="ListItem__heading">
						{fullName}
					</div>
				</div>
				<div className="ListItem__chevron" />
			</Link>
			)
	}
})
