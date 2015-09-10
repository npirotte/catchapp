var EventEmitter = require('events').EventEmitter;
var HttpService = require('../lib/HttpService');
var Storate = require('../lib/localStorage');
var URI = require('URIjs');

import AuthStore from './AuthStore.js';
import dispatcher from '../lib/dispatcher';

var storage = Storate.get('FriendsStore', 'object') || {};

class FriendsStore {

	constructor()
	{
		this.requestSize = 9999;
		this.emitter = new EventEmitter();
	}

	createFriendship(user)
	{
		var { id } = AuthStore.user();
		var friendship = {
			participants : [id, user.id]
		};

		var opts = {
			endpoint : 'friendships',
			method : 'POST',
			data : friendship
		}

		HttpService(opts, (err, res) => {
			console.log(err, res)
			if(!err) {
				dispatcher.emit('FriendsStore.friendshipUpdated.user:' + user.id, res);
			}
		});
	}

	getFriends(userId)
	{
		if (!storage[userId]) storage[userId] = [];
		if (storage[userId].length === 0) {
			this.getMoreFriends(userId);
		};
		return storage[userId];
	}

	refresh(userId)
	{
		this.getMoreFriends(userId);
	}

	getMoreFriends(userId)
	{
		var url = new URI('user/' + userId + '/friends');
		url.setSearch({skip : 0, limit : this.requestSize});

		var opt = {
			endpoint : url
		}

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

		if (storage[userId]) {
			storage[userId].forEach((friend) => {
				if (ids.indexOf(friend.id) >= 0) {
					friends[friend.id] = friend;
				};
			});
		};

		return friends;
	}
}

export default FriendsStore;
