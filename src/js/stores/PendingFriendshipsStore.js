import dispatcher from '../lib/dispatcher';
import HttpService from '../lib/HttpService';

var storage = [];

class PendingFriendshipsStore {
  constructor() {

  }

  refresh() {
    var opts = {
      endpoint : 'friendships/pending'
    }
    HttpService(opts, function(err, res) {
      if(!err) {
        storage = res;
        dispatcher.emit('PendingFriendshipsStore.update');
      }
    });
  }

  getData() {
    return storage;
  }
}

export default PendingFriendshipsStore;
