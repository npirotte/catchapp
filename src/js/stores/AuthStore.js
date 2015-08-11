var EventEmitter = require('events').EventEmitter
var HttpService = require('../lib/HttpService')
var Storate = require('../lib/localStorage');

const {serverUrl} = require('../config');

const debug= true;

var storage = Storate.get('AuthStore') || {};
var registrationData = {};

function _saveStorage()
{
	Storate.set('AuthStore', storage);
}

window.socket = io.connect(serverUrl);

function AuthStore()
{
	var _this = this;

	this.emitter = new EventEmitter();

	if (this.amRegistered) {
		socket.post(serverUrl + 'sockets/subscribe', {refreshToken : storage.refreshToken}, function(resData){
			console.log(resData);
		});
	};

	this.login = function (data, cb)
	{
		var opt = {
			data : data,
			endpoint : 'auth/login',
			method : 'POST'
		}

		HttpService(opt, function(err, res)
		{

			storage = res;
			_saveStorage();

			socket.post(serverUrl + 'sockets/subscribe', {refreshToken : storage.refreshToken}, function(resData){
				console.log(resData);
			});

			if (cb) {
				cb(err, res);
			};

			if (err) return false;
		})
	}

	this.amRegistered = function()
	{
		return !!storage.token;
	}

	this.refreshToken  = function(cb)
	{
		
		var opt = {
			data : { refreshToken : storage.refreshToken },
			endpoint : 'auth/refreshtoken',
			method : 'POST'
		}

		if (debug) console.log('refreshtoken started');

		HttpService(opt, function(err, res)
		{
			if (debug) console.log('refreshtoken received', err, res);

			if (err) return false;

			var response = res;

			storage.refreshToken = response.refreshToken;

			storage.token = response.token;
			
			_saveStorage();

			if (cb) {
				cb(err, res);
			};
		});
	}

	this.user = function()
	{
		return storage.user;
	}

	this.logoff = function()
	{
		storage = null;
		localStorage.clear();
		window.location.reload();
	}

	this.saveRegistration = function(data)
	{
		registrationData = data;
	},

	this.register = function(cb)
	{
		var opts = {
			endpoint : 'user',
			method : 'POST',
			data : registrationData
		}

		HttpService(opts, (err, data) => {

			if (err) {
				cb(err);
				return false;
			};

			this.login({username : registrationData.username, password: registrationData.password}, function(err2, data2){
				cb(err2, data);
			});
		});
	}

	this.update = function(data, cb)
	{

		for(var k in data)
		{
			storage.user[k] = data[k];
		}

		console.log(storage);
		storage.user.fullName = storage.user.firstName + ' ' + storage.user.lastName;

		_saveStorage();

		_this.emitter.emit('update');

		var opts = {
			data : data,
			endpoint : 'user/' + storage.user.id,
			method : 'PUT',
			data : data
		}

		HttpService(opts, function(err, data)
		{
			if(typeof cb === 'function')
			{
				cb(err, data);
			}
		});
	}

/*	this.token = function ()
	{
		return storage.token || undefined;
	}*/
}

var store = new AuthStore();

module.exports = store;