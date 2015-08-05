const {serverUrl} = require('../config');

module.exports = function(data, imageSize)
{
	if (typeof data === 'undefined') {
		return './img/no-image.png';
	}

	if (typeof data === 'string') {
		data = {
			id : data,
			filename : 'image.jpg'
		}	
	}

	var imageSizeString = imageSize ? (imageSize + 'x' + imageSize + '/') : '';
	
	return serverUrl + 'assets/' + data.id + '/' + imageSizeString + data.filename;
}