var React = require('react');
var blacklist = require('blacklist');

var CheckBox = React.createClass({

	displayName : 'CheckBox',

	render() {

		var className = 'c-checkbox ' + this.props.className;
		var props = blacklist(this.props, 'children', 'className');

		return (
			<label className={className}>
				<input className="c-checkbox__input" type="checkbox" {...props} />
				<span className="c-checkbox__label">{this.props.children}</span>
			</label>
			)
	}

});

export default CheckBox;