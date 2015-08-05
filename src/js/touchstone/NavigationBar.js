var classNames = require('classnames');
var React = require('react/addons');
var Tappable = require('react-tappable');
var Transition = React.addons.CSSTransitionGroup;

var defaultControllerState = {
	direction: 0,
	fade: false,
	leftArrow: false,
	leftButtonDisabled: false,
	leftIcon: '',
	leftLabel: '',
	leftAction: null,
	rightArrow: false,
	rightButtonDisabled: false,
	rightIcon: '',
	rightLabel: '',
	rightAction: null,
	title: ''
};

function newState (from) {
	var ns = Object.assign({}, defaultControllerState);
	if (from) Object.assign(ns, from);
	delete ns.name; // may leak from props
	return ns;
}

var NavigationBar = React.createClass({
	contextTypes: {
		app: React.PropTypes.object
	},
	propTypes: {
		name: React.PropTypes.string
	},
	getInitialState () {
		return newState(this.props);
	},
	componentDidMount () {
		if (this.props.name) {
			this.context.app.navigationBars[this.props.name] = this;
		}
	},
	componentWillUnmount () {
		if (this.props.name) {
			delete this.context.app.navigationBars[this.props.name];
		}
	},
	componentWillReceiveProps (nextProps) {
		this.setState(newState(nextProps));
		if (nextProps.name !== this.props.name) {
			if (nextProps.name) {
				this.context.app.navigationBars[nextProps.name] = this;
			}
			if (this.props.name) {
				delete this.context.app.navigationBars[this.props.name];
			}
		}
	},
	update (state) {
		state = newState(state);
		// console.info('Updating NavigationBar ' + this.props.name, state);
		this.setState(newState(state));
	},
	updateWithTransition (state, transition) {
		state = newState(state);
		if (transition === ('show-from-right' || 'reveal-from-left')) {
			state.direction = 1;
		} else if (transition === ('reveal-from-right' || 'show-from-left')) {
			state.direction = -1;
		} else if (transition === 'fade') {
			state.fade = true;
		}
		// console.info('Updating NavigationBar ' + this.props.name + ' with transition ' + transition, state);
		this.setState(state);
	},

	renderLeftButton () {
		var className = classNames('NavigationBarLeftButton', {
			'has-icon': this.state.leftArrow || this.state.leftIcon
		});

		return (
			<Tappable onTap={this.state.leftAction} className={className} disabled={this.state.leftButtonDisabled} component="button">
				{this.renderLeftArrow()}
				{this.renderLeftIcon()}
				{this.renderLeftLabel()}
			</Tappable>
		);
	},
	renderLeftArrow () {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade || this.state.direction) {
			transitionName = 'NavigationBarTransition-Fade';
		}

		var arrow = this.state.leftArrow ? <span className="NavigationBarLeftArrow" /> : null;

		return (
			<Transition transitionName={transitionName}>
				{arrow}
			</Transition>
		);
	},
	renderLeftIcon () {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade || this.state.direction) {
			transitionName = 'NavigationBarTransition-Fade';
		}
		var className = classNames('NavigationBarLeftIcon', this.state.leftIcon);
		var icon = this.state.leftIcon ? <span className={className} /> : null;

		return (
			<Transition transitionName={transitionName}>
				{icon}
			</Transition>
		);
	},
	renderLeftLabel () {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade) {
			transitionName = 'NavigationBarTransition-Fade';
		} else if (this.state.direction > 0) {
			transitionName = 'NavigationBarTransition-Forwards';
		} else if (this.state.direction < 0) {
			transitionName = 'NavigationBarTransition-Backwards';
		}

		return (
			<Transition transitionName={transitionName}>
				<span key={Date.now()} className="NavigationBarLeftLabel">{this.state.leftLabel}</span>
			</Transition>
		);
	},
	renderTitle () {
		var title = this.state.title ? <span key={Date.now()} className="NavigationBarTitle">{this.state.title}</span> : null;
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade) {
			transitionName = 'NavigationBarTransition-Fade';
		} else if (this.state.direction > 0) {
			transitionName = 'NavigationBarTransition-Forwards';
		} else if (this.state.direction < 0) {
			transitionName = 'NavigationBarTransition-Backwards';
		}

		return (
			<Transition transitionName={transitionName}>
				{title}
			</Transition>
		);
	},
	renderRightButton () {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade || this.state.direction) {
			transitionName = 'NavigationBarTransition-Fade';
		}
		var button = (this.state.rightIcon || this.state.rightLabel) ? (
			<Tappable key={Date.now()} onTap={this.state.rightAction} className="NavigationBarRightButton" disabled={this.state.rightButtonDisabled} component="button">
				{this.renderRightLabel()}
				{this.renderRightIcon()}
			</Tappable>
		) : null;
		return (
			<Transition transitionName={transitionName}>
				{button}
			</Transition>
		);
	},
	renderRightIcon () {
		if (!this.state.rightIcon) return null;

		var className = classNames('NavigationBarRightIcon', this.state.rightIcon);

		return <span className={className} />;
	},
	renderRightLabel () {
		return this.state.rightLabel ? <span key={Date.now()} className="NavigationBarRightLabel">{this.state.rightLabel}</span> : null;
	},
	render () {
		var className = classNames('NavigationBar', {
			'has-left-arrow': this.state.leftArrow,
			'has-left-icon': this.state.leftIcon,
			'has-left-label': this.state.leftLabel,
			'has-right-icon': this.state.rightIcon,
			'has-right-label': this.state.rightLabel
		});
		return (
			<div className={className}>
				{this.renderLeftButton()}
				{this.renderTitle()}
				{this.renderRightButton()}
			</div>
		);
	}
});

/*
function createController () {
	var state = newState();
	var listeners = [];
	return {
		update (ns) {
			state = newState(ns);
			listeners.forEach(fn => fn());
		},
		getState () {
			return state;
		},
		addListener (fn) {
			listeners.push(fn);
		},
		removeListener (fn) {
			listeners = listeners.filter(i => fn !== i);
		}
	};
}
*/

export default NavigationBar;
