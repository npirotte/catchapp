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
}

CatchsStore.prototype.emitter = new EventEmitter();

CatchsStore.prototype.getCatchs = function()
{
	if ( (!this.storage || this.storage.length < this.requestSize) && !this.noMoreItems) {
		this.getMoreCatchs(this.storage.length);
	};

	return this.storage;
}

CatchsStore.prototype.getMoreCatchs = function(skip)
{
	var url = new URI('catchs');
	url.setSearch({skip : skip || this.storage.length, limit : this.requestSize, sort : 'createdAt DESC'});

	var opt = {
		endpoint : url
	}

	HttpService(opt, (err, res) =>
	{
		console.log(err, res);
		if (err) return false;

		var data = res;

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