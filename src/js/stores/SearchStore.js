import EventEmitter from 'events';
import HttpService from '../lib/HttpService';
import URI from 'URIjs';

const queryUrl = 'user';

var lastRequestTimeStamp;
var storage = [];

function _getFilter(query)
{
	return {
		or : [
			{
				firstName : {
					'contains' : query
				}
			},
			{
				lastName : {
					'contains' : query
				}
			},
			{
				fullName : {
					'contains' : query
				}
			}
		]
	};
}

export default class SearchStore {

  constructor() {
    this.requestSize = 20;
    this.emitter = new EventEmitter();
    this.query = '';
  }

  getData() {
    return storage;
  }

  setQuery(query) {

    this.query = query;

    var url = new URI(queryUrl);
    url.setSearch({where : JSON.stringify(_getFilter(this.query)), limit : this.requestSize, skip : 0});

    var ops = {
			endpoint : url
		}

    var date = new Date();
    var requestTimeStamp = date.getTime();
    lastRequestTimeStamp = date.getTime();

    HttpService(ops, (err, res) => {
      if(requestTimeStamp !== lastRequestTimeStamp) return;
      if(err) return false;

      storage = res;

      if (res.length < this.requestSize) {
        this.emitter.emit('noMoreItems');
      }

      this.emitter.emit('update');

    });
  }

  cleanUp() {
    this.query = '';
    storage = [];
  }
}
