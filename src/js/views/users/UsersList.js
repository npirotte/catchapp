var React = require('react');
var UserItem = require('./UserItem');

module.exports = React.createClass({
	propTypes : {
		users : React.PropTypes.array,
		previousViewProps : React.PropTypes.object,
		previousView : React.PropTypes.string
	},
	displayName : 'UsersList',
	render : function()
	{
		var items = this.props.users.map(function(userItem)
		{
			return <UserItem key={userItem.id} userItem={userItem} previousView={this.props.previousView} previousViewProps={this.props.previousViewProps} />
		}.bind(this));

		return (
			<div>
				{items}
			</div>
			)
	}
})
