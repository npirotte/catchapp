var React = require('react');

const AVATAR_CLASSNAME = 'ListItem__avatar';

function _getInitial(input)
{
	return input[0];
}

export default React.createClass({

	render ()
	{
		var className = AVATAR_CLASSNAME;

		return this.props.src ? this.renderImage() : this.renderInitial();
	},

	renderImage()
	{
		var className = AVATAR_CLASSNAME;
		className += ' ListItem__avatar--image ' + this.props.className;

		var style = { backgroundImage : 'url(' + this.props.src + ')' }

		return (
			<span alt={this.props.name} style={style} className={className} />
			);
	},

	renderInitial()
	{
		var className = AVATAR_CLASSNAME;
		var initial = _getInitial(this.props.name);

		className += ' ListItem__avatar--initial ListItem__avatar--initial--' + initial.toLowerCase();

		return (
			<span className={className} >{initial}</span>
			);
	}

});