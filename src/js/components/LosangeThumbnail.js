var React = require('react');

const IMG_CLASSNAME = 'losange-thumbnail';

function _getInitial(input)
{
	return input[0];
}

module.exports = React.createClass({

	render ()
	{
		var className = IMG_CLASSNAME;
		var src = this.props.src  || './img/no-image.png';

		return this.renderImage();
	},

	renderImage()
	{
		var className = IMG_CLASSNAME;
		var classNameImg = IMG_CLASSNAME + '--image ';

		var src = this.props.src  || './img/no-image.png';

		return (
				<div className={className}>
					<div style={{backgroundImage : 'url(' +src + ')'}} className={classNameImg}> </div>
					<img style={{display : 'none'}}  className="hidden" src={src}  />
				</div>
			);
	},

});
