export default {
	get : function(key, type)
	{
		var output;

		if (window.localStorage[key]) {
			try
			{
				output = JSON.parse(window.localStorage[key])
			}
			catch(e)
			{
				output = window.localStorage[key]
			}
		}
		else
		{
			switch(type)
			{
				case 'array':
					output = [];
					break;
				case 'object':
					output = {};
					break;
				default:
					output = null;
					break;
			}
		}

		return output
	},
	set : function(key, data)
	{
		if (typeof data === 'object') {
			data = JSON.stringify(data);
		}
		window.localStorage[key] = data;
	}
}
