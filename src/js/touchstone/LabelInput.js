var React = require('react/addons');
var blacklist = require('blacklist');
var classnames = require('classnames');

module.exports = React.createClass({
	displayName: 'LabelInput',

	propTypes: {
		alignTop: React.PropTypes.bool,
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		first: React.PropTypes.bool,
		label: React.PropTypes.string,
		readOnly: React.PropTypes.bool,
		required: React.PropTypes.bool,
		value: React.PropTypes.string,
		type: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			type: 'text',
			readOnly: false
		};
	},

	getInitialState () {
		return {
			value : this.props.value || this.props.defaultValue
			}
	},

	onChange (event)
	{
		this.setState({ value : event.target.value });

		if (this.props.onChange) {
			this.props.onChange(event);
		};
	},

	getValue ()
	{
		return this.refs.input.getDOMNode().value
	},

	render () {
		var className = classnames(this.props.className, 'list-item', 'field-item', {
			'align-top': this.props.alignTop,
			'is-first': this.props.first,
			'u-selectable': this.props.disabled,
			'active': this.state.value
		});

		console.log(className);

		var props = blacklist(this.props, 'alignTop', 'children', 'first', 'readOnly', 'onChange');
		var renderInput = this.props.readOnly ? (
			<div className="field u-selectable">{this.props.value}</div>
		) : (
			<input ref="input" className="field" {...props} onChange={this.onChange}/>
		);

		return (
			<label className={className}>
				<div className="item-inner">
					<div className="field-control">
						{renderInput}
						{this.props.children}
						<div className="field-label">{this.props.label}</div>
					</div>
				</div>
			</label>
		);
	}
});
