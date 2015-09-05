var React = require('react');
var Container = require('react-container');
var Hammer = require('react-hammerjs');

var Spinner = require('./Spinner');

const scrollable = Container.initScrollable();
const hammerConfig = {recognizers:{pan:{threshold:0}}};
const maxPull = 83;
const minTime = 600;

export default React.createClass({

	displayName : 'PullToRefreshContainer',

	getInitialState() {
		return {
			pullToRefreshHeight : 0
		}
	},

	render() {
		var pullToRefreshStyle = { height : this.state.pullToRefreshHeight + 'px' };

		return (
			<Container direction="column">
				<div className="pull-to-refresh" ref="pullToRefresh" style={pullToRefreshStyle}>
					<div className="pull-to-refresh__content">
						<Spinner type={12} />
					</div>
				</div>
				<Container fill scrollable={scrollable} ref="scrollContainer" onScroll={this.handleScroll}>
					<Hammer onPan={this.onPan} options={hammerConfig}>
					{this.props.children}

					</Hammer>
				</Container>
			</Container>
			)
	},

	loader ()
	{
		//if (!this.props.loading) return false;

		return (
			<Spinner type={12} />
			)
	},

	handleScroll (event)
	{
		if (!this.props.onInfinite) return false;

		var pass = (event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) === 0;

		if (pass && !this.props.loading) {
			console.log('bingo');
			this.setState({loading : true});
			this.props.onInfinite();
			//CatchsStore.getMoreCatchs();
		};
	},

	onPan(event) {

		if(!this.props.onRefresh) return false;
		
		var scrollPosition = this.refs.scrollContainer.getDOMNode().scrollTop,
			pullToRefreshElement = this.refs.pullToRefresh.getDOMNode(),
			amount = 0;

		if (!this.panning && !this.panStartScrollPosition) {
			// event should be first record scroll position
			this.panStartScrollPosition = scrollPosition;
		};

		if (scrollPosition === 0 && event.deltaY > 0) {
			this.panning = true;
			amount = event.deltaY - this.panStartScrollPosition;
			amount = amount > maxPull ? maxPull : amount;
			pullToRefreshElement.style.height = amount + 'px';
			this.state.pullToRefreshHeight = amount;
		};

		if (event.isFinal) {
			if (amount >= maxPull) {
				this.timer = new Date().getTime();
				this.props.onRefresh();
			}
			else
			{
				this.release();
			}
		};

		if (this.panning) {
			event.preventDefault();
			return false;
		};
	},

	release() {
		var pullToRefreshElement = this.refs.pullToRefresh.getDOMNode(),
			newTime = new Date().getTime();

		setTimeout(() => {
			pullToRefreshElement.style.height = '0px';

			this.state.pullToRefreshHeight = 0;
			this.panStartScrollPosition = 0;
			this.panning = false;
		}, minTime - (newTime - this.timer));
	}

});
