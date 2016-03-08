import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  defaultThumbnail: 'http://duraark.tib.eu/data/public/BuildingData/04_thumbnails/selection/Nygade_Scan1001.ifc.png',

  isWIP: function() {
    return this.get('session.state') === 'wip';
  }.property('session'),

  isArchived: function() {
    return this.get('session.state') === 'archived';
  }.property('session'),

  isNew: function() {
    return this.get('session.state') === 'new';
  }.property('session'),

  isDemoSession: function() {
      return this.get('session.label') === 'Nygade';
  }.property('session'),

  thumbnail: function() {
    let thumbnail = this.get('session.thumbnail');
    if (thumbnail) {
      return thumbnail;
    }

console.log('asdfasdfasdf');
    return this.get('defaultThumbnail');
  }.property('session'),

  actions: {
    editClicked: function(session) {
      this.sendAction('editClicked', session);
    },

    deleteClicked: function(session) {
      alert('This public demo server does not allow the deletion of fixed sessions!');
      // this.sendAction('deleteClicked', session);
    }
  }
});
