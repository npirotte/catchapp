var React = require('react');
var CatchsItem = require('./CatchsItem');

module.exports = React.createClass({
	displayName: 'CatchsList',

	componentDidMount()
	{
		var _this = this;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( function(position) {
				console.log(position);
				_this.setState({myPosition : position})
			});
		}
	},

	getInitialState()
	{
		return {
			myPosition : undefined
		}
	},

	render()
	{
		var items = this.props.catchs.map(function(catchItem, i)
		{
			return <CatchsItem key={'catch_' + i} catchItem={catchItem} myPosition={this.state.myPosition} />
		}.bind(this));

		return (
			<div>
				{items}
			</div>
			)
	}
})