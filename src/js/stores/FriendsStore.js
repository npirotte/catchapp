var EventEmitter = require('events').EventEmitter
var HttpService = require('../lib/HttpService')
var Storate = require('../lib/localStorage')

var URI = require('URIjs');

var storage = Storate.get('FriendsStore', 'object') || {};

class FriendsStore {

	constructor() 
	{
		this.requestSize = 9999;
		this.emitter = new EventEmitter();
	}


	getFriends(userId)
	{
		console.log(userId, storage);
		if (!storage[userId]) storage[userId] = [];
		if (storage[userId].length === 0) {
			this.getMoreFriends(userId);
		};
		return storage[userId];
	}

	getMoreFriends(userId)
	{
		var url = new URI('user/' + userId + '/friends');
		url.setSearch({skip :  0, limit : this.requestSize});

		var opt = {
			endpoint : url
		}

		console.log(this);

		HttpService(opt, (err, res) => {
			if (err) return false;

			var data = res;

			if (storage[userId]) {
				storage[userId] = storage[userId].concat(data);
			}
			else
			{
				storage[userId] = data;
			}

			if (data.length < this.requestSize) {
				this.emitter.emit('noMoreItems:' + userId);
			}

			this.emitter.emit('update:' + userId);

			Storate.set('FriendsStore', storage);

		});
	}

	getManyByIds(userId, ids)
	{
		var friends = {};

		storage[userId].forEach((friend) => {
			if (ids.indexOf(friend.id) >= 0) {
				friends[friend.id] = friend;
			};
		});

		return friends;
	}
}

export default FriendsStore;