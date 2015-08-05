var React = require('react');
var { Link } = require('../touchstone');

module.exports = React.createClass({
	render()
	{
		return (
			<Link to="main:users-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				{this.props.userItem.fullName}
			</Link>
			)
	}
})