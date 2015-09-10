var Container = require('react-container');
var Sentry = require('react-sentry');
var React = require('react');
var Tappable = require('react-tappable');
var {Transitions} = require('../../touchstone');

var CatchsList = require('../../components/CatchsList');

var PullToRefreshContainer = require('../../components/PullToRefreshContainer');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var CatchsStore = require('../../stores/CatchsStore');

const scrollable = Container.initScrollable();

module.exports = React.createClass({

	displayName : 'ViewCatchsList',

	mixins: [Sentry(), Transitions],

	statics: {
		navigationBar: 'main',
		getNavigation () {
			return {
				leftIcon: 'ion-android-menu',
				leftAction: emitter.emit.bind(emitter, 'navigationBarLeftAction'),
				rightIcon: 'ion-plus',
				rightAction : emitter.emit.bind(emitter, 'createNewCatch'),
				title: 'Goop\'s',
				titleAction : emitter.emit.bind(emitter, 'navigationBarTitleAction')
			};
		}
	},

	getInitialState ()
	{
		var catchs = CatchsStore.getCatchs();
		return {
			catchs : catchs,
			noMoreItems : false,
			loading : catchs.length === 0
		}
	},

	componentDidMount ()
	{

		var body = document.getElementsByTagName('body')[0];

		CatchsStore.emitter.on('update', this.getData);

		CatchsStore.emitter.once('noMoreItems', event => {
			this.setState({noMoreItems : true})
		});

		// navbar actions
		this.watch(emitter, 'navigationBarLeftAction', function () {
			body.classList.toggle('android-menu-is-open');
		});

		emitter.once('createNewCatch', event => {
			console.log(event);
			this.transitionTo('main:catchs-form', {});
		});

		this.watch(emitter, 'navigationBarTitleAction', (event) => {
			this.refs.pullToRefresh.scrollContainerToTop();
		});

	},

	getData ()
	{
		this.setState({catchs : CatchsStore.getCatchs(), loading : false});
		if (this.refreshing) {
			this.refs.pullToRefresh.release();
			this.refreshing = false;
		};
	},

	render ()
	{
		console.log(this.state.catchs);
		return (
			<Container direction="column">
				<PullToRefreshContainer onRefresh={this.onRefresh}  onInfinite={this.loadMore} loading={this.state.loading} ref="pullToRefresh" >
					<CatchsList catchs={this.state.catchs} />
				</PullToRefreshContainer>
			</Container>
			)
	},

	loadMore (event)
	{
		this.setState({loading : true});
		CatchsStore.getMoreCatchs(this.state.catchs.length);
	},

	loader ()
	{
		if (!this.state.loading) return false;

		return (
			<div>Loading</div>
			)
	},

	onRefresh ()
	{
		CatchsStore.refresh();
		this.refreshing = true;
	}

})
