import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  isWIP: function() {
    return this.get('session.state') === 'wip';
  }.property('session'),

  isArchived: function() {
    return this.get('session.state') === 'archived';
  }.property('session'),

  isNew: function() {
    return this.get('session.state') === 'new';
  }.property('session'),

  actions: {
    deleteClicked: function(session) {
      this.sendAction('deleteClicked', session);
    }
  }
});
