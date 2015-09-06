import React from 'react';
import Tappable from 'react-tappable';
import FriendsStore from '../stores/FriendsStore.js';

var friendsStore = new FriendsStore();

const TEXT = {
  new : 'Devenir amis',
  pending : 'Demande en attente',
  approved : 'Ne plus être amis'
};

export default React.createClass({

  displayName : 'FriendshipButton',

  render : function() {

    if(!this.props.user.friendship) return <span></span>;

    var text = this.props.user.friendship.statut ? TEXT[this.props.user.friendship.statut] : TEXT.new;
    return (
      <Tappable className="button button-primary" onTap={this.handleClick}>{text}</Tappable>
    )
  },

  handleClick : function(event) {
    event.preventDefault();
    friendsStore.createFriendship(this.props.user);
  }

});
