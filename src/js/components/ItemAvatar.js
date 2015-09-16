var React = require('react');

const AVATAR_CLASSNAME = 'item-avatar';

function _getInitial(input)
{
	return input[0];
}

module.exports = React.createClass({

	render ()
	{
		if( this.props.losange ){
			return this.props.src ? this.renderLosangeImage() : this.renderLosangeInitial();
		}else{
			return this.props.src ? this.renderImage() : this.renderInitial();
		}

	},

	renderImage()
	{
		var className = AVATAR_CLASSNAME;
		className +=  ' ' + AVATAR_CLASSNAME + '--image' ;

		if(this.props.className){
			className += ' ' + this.props.className
		}

		var style = { backgroundImage : 'url(' + this.props.src + ')' }

		return (
			<span alt={this.props.name} style={style} className={className} />
			);
	},

	renderInitial()
	{
		var initial = _getInitial(this.props.name);

		var className = AVATAR_CLASSNAME;
		className += ' ' + AVATAR_CLASSNAME + '--initial' + AVATAR_CLASSNAME + '--initial--' + initial.toLowerCase();
		
		if(this.props.className){
			className += ' ' + this.props.className
		}

		return (
			<span className={className} >{initial}</span>
			);
	},

	renderLosangeImage()
	{

		var className = AVATAR_CLASSNAME;
		className +=  ' ' + AVATAR_CLASSNAME + '--image_losange' ;

		if(this.props.className){
			className += ' ' + this.props.className
		}

		if( this.props.color ){
			className +=  ' ' + AVATAR_CLASSNAME + '--image_losange_' + this.props.color;
		}

		var src = this.props.src;

		return (
				<div alt={this.props.name} className={className}>
					<div style={{backgroundImage : 'url(' +src + ')'}}></div>
				</div>
			);
	},

	renderLosangeInitial()
	{
		var initial = _getInitial(this.props.name);

		var className = AVATAR_CLASSNAME;
		className +=  ' ' + AVATAR_CLASSNAME + '--initial_losange' ;

		if(this.props.className){
			className += ' ' + this.props.className
		}

		if( this.props.color ){
			className +=  ' ' + AVATAR_CLASSNAME + '--initial_losange_' + this.props.color;
		}

		return (
				<div alt={this.props.name} className={className}>
					<div>{initial}</div>
				</div>
			);
	}


});
