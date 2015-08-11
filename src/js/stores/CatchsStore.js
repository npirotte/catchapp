var EventEmitter = require('events').EventEmitter
var HttpService = require('../lib/HttpService')
var Storate = require('../lib/localStorage')

var URI = require('URIjs');


function _saveStorage()
{
	Storate.set('CatchsStore', storage);
}

function CatchsStore()
{
	EventEmitter.call(this);

	this.storage = Storate.get('CatchsStore') || [];
	this.requestSize = 12;

	setTimeout(function()
	{
		window.socket.on('catchCreated', function(data) {
			console.log(data);
			//this.storage.unshift(data);
			//this.emitter.emit('update');
		});
	})

	
}

CatchsStore.prototype.emitter = new EventEmitter();

CatchsStore.prototype.getCatchs = function()
{
	if ( (!this.storage || this.storage.length < this.requestSize) && !this.noMoreItems) {
		this.getMoreCatchs(this.storage.length);
	};

	return this.storage;
}

CatchsStore.prototype.refresh = function()
{
	this.storage = [];
	this.getMoreCatchs(0);
}

CatchsStore.prototype.getMoreCatchs = function(skip)
{
	console.log(skip);
	var url = new URI('catchs');
	url.setSearch({skip : skip, limit : this.requestSize, sort : 'createdAt DESC', r : Math.random()});

	var opt = {
		endpoint : url
	}

	HttpService(opt, (err, res) =>
	{
		if (err) return false;

		var data = res;

		console.log(this.storage);

		if (this.storage.length) {
			this.storage = this.storage.concat(data);
		}
		else
		{
			this.storage = data;
		}

		if (data.length < this.requestSize) {
			this.noMoreItems = true;
			this.emitter.emit('noMoreItems');
		}

		this.emitter.emit('update');

		//_saveStorage(),
	})
}

CatchsStore.prototype.sendCatch = function(data, cb)
{
	var opt = {
		endpoint : 'catchs',
		method : 'POST',
		data : data
	}

	HttpService(opt, (err, res) =>
	{
		console.log(err, res);

		if (typeof cb === "function") {
			cb(err, res);
		};
	});
}

var store = new CatchsStore();

module.exports = store;