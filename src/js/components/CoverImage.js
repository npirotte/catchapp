var React = require('react');

var CoverImage = React.createClass({

	displayName : 'CoverImage',

	render()
	{
		var style = { backgroundImage : 'url(' + this.props.src + ')' }

		return (
			<div className="cover-image">
				<div className="cover-image__image" style={style}>
				</div>
				<div className="cover-image__title">
					{this.props.title}
				</div>
			</div>
			)
	}

});

export default CoverImage; 