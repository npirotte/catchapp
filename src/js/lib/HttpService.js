var async = require('async')
var defaults = require('defaults')
var httpify = require('httpify')

var Storate = require('../lib/localStorage')

const {serverUrl} = require('../config');

const url = 'http://192.168.1.7:1337/';
const debug = false;

var queue = [],
	waitingToken = false;

function refreshToken()
{
	if (debug) {
		console.log('Refresh token called by http service', queue);
	};
	var AuthStore = require('../stores/AuthStore');

	AuthStore.refreshToken(function(err, res)
	{
		if (debug) console.log(err, res);
		if(err) return false;

		queue.forEach(request => {
			if (debug) console.log(request);
			engine(request.opts, request.callback)
		})
	});
}

var engine = function(opts, callback)
{
	var { endpoint, data, method } = opts;

	var { token } = Storate.get('AuthStore', 'object');

 	var http_request = new XMLHttpRequest();

 	http_request.onreadystatechange  = function(){
      if (http_request.readyState == 4  )
      {
        // Javascript function JSON.parse to parse JSON data
        var jsonObj = JSON.parse(http_request.responseText);

        if(debug) console.log(http_request, jsonObj);

        if (http_request.status !== 200 && http_request.status !== 201) {

        	if (jsonObj.status === 401 && jsonObj.inner.name === 'TokenExpiredError' ) {
        		async.nextTick(function()
        		{
        			if (debug) console.log('token expired');

        			queue.push({opts : opts, callback : callback});

        			if (!waitingToken) {
        				waitingToken = true;
        				refreshToken();
        			};
        		})
        	};

        	return callback(new Error('Error ' + http_request.status));
        };

        callback(null, jsonObj);

      }
   }

   http_request.open(method || 'GET', serverUrl + endpoint, true);
   http_request.setRequestHeader("Content-Type", "text/xml");
   if (token)
   {
   		http_request.setRequestHeader("Authorization", 'Bearer ' + token);
   }
   http_request.send(JSON.stringify(data) || null);
}

module.exports = engine;
