var Storate = require('../lib/localStorage');

const {serverUrl} = require('../config');

var url = serverUrl + 'assets/upload',
	trustHosts = true,
	upOptions = {
		headers: {
			//Authorization : 'Bearer ' + $localStorage.token
		}
	};

export default function(fileURL, cb)
{
	console.log(fileURL, cb);

	var { token } = Storate.get('AuthStore', 'object');

	var options = new FileUploadOptions();

	options.fileKey="file";
	options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	options.headers = {
		'Authorization' :  'Brearer ' + token
	};

	var ft = new FileTransfer();

	console.log(fileURL, url, win, fail, options);

	ft.upload(fileURL, url, win, fail, options);

	function win(res)
	{
		if (res.responseCode === 200) {
			return cb(null, JSON.parse(res.response));
		}
		else
		{
			return cb(new Error(res.responseCode))
		}
	}

	function fail(err)
	{
		return cb(err);
	}
}