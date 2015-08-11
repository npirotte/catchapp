var React = require('react');
var UserItem = require('./UserItem');

module.exports = React.createClass({
	displayName: 'UsersList',
	render: function()
	{
		var items = this.props.users.map(function(userItem, i)
		{
			return <UserItem key={'catch_' + i} userItem={userItem} />
		});

		return (
			<div>
				{items}
			</div>
			)
	}
})