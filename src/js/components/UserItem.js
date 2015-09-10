import React from 'react';
import { Link } from 'touchstonejs';
import moment from 'moment';

import ItemAvatar from './ItemAvatar';

import ImageUrl from '../filters/ImageUrl';

/* time a user is displayed active in minutes */
const INACTIVITY_DELAY = 30;

module.exports = React.createClass({
	render : function()
	{

		var imageUrl = this.props.userItem.asset ? ImageUrl(this.props.userItem.asset, 180) : null;
		var fullName = this.props.userItem.fullName || (this.props.userItem.firstName + ' ' + this.props.userItem.lastName);

		var now = moment();
		var lastActivity = this.props.userItem.lastActivity ? moment(this.props.userItem.lastActivity) : null;
		var lastActivityDisplay = lastActivity ? lastActivity.fromNow() : 'jamais';
		var isActive = lastActivity ? !lastActivity.isBefore(now.subtract(INACTIVITY_DELAY, 'm')) : false;
		var activeClass = 'ListItem__activity-display ListItem__activity-display--' + (isActive ? 'active' : 'inactive');

		return (
			<Link to="main:users-details" viewProps={this.props} transition="show-from-right" className="ListItem Person" component="div">
				<ItemAvatar src={imageUrl} name={fullName} />
				<div className="ListItem__content">
					<div className="ListItem__heading">
						{fullName}
					</div>
					<div className="ListItem__text">
						<span className={activeClass}></span>
						{lastActivityDisplay}
					</div>
				</div>
				<div className="ListItem__chevron" />
			</Link>
			)
	}
})
