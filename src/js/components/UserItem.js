var React = require('react');
var { Link } = require('../touchstone');

var ItemAvatar = require('./ItemAvatar');

var ImageUrl = require('../filters/ImageUrl');

module.exports = React.createClass({
	render()
	{
		var imageUrl = this.props.userItem.asset ? ImageUrl(this.props.userItem.asset) : null;

		return (
			<Link to="main:users-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				<ItemAvatar src={imageUrl} name={this.props.userItem.fullName} />
				<div className="ListItem__content">
					<div className="ListItem__heading">
						{this.props.userItem.fullName}
					</div>
				</div>
				<div className="ListItem__chevron" />
			</Link>
			)
	}
})