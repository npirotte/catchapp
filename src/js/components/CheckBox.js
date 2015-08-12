var React = require('react');
var Tappable = require('react-tappable');
var blacklist = require('blacklist');

var CheckBox = React.createClass({

	displayName : 'CheckBox',

	getInitialState ()  {
		return {
			checked : this.props.checked || this.props.defaultChecked
		}
	},

	onChange (event)
	{
		if (this.props.onChange) {
			this.props.onChange(event)
		};

		this.setState({ checked : event.target.checked });
	},

	render() {

		var className = 'c-checkbox ' + this.props.className;
		var props = blacklist(this.props, 'children', 'className', 'onChange');

		if (this.state.checked) {
			className += ' c-checkbox--checked';
		};

		return (
			<Tappable className={className} component="label">
				<input className="c-checkbox__input" type="checkbox" onChange={this.onChange} {...props} />
				<span className="c-checkbox__label">{this.props.children}</span>
			</Tappable>
			)
	}

});

export default CheckBox;