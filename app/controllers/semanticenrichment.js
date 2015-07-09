import Ember from 'ember';

function post(url, data) {
  var that = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    Ember.$.post(url, data, handler);
  });
};

export default Ember.Controller.extend({
  seeds: null,

  actions: {
    next: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('semanticenrichment', session);
    },

    back: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('metadata', session);
    },

    showTopics: function(item) {
      this.set('fileInfo', item);
    },

    clickedTopic: function(topic) {
      var selectedDigitalObject = this.get('fileInfo'),
        currentTopics = selectedDigitalObject.get('semMD.topics');

      var isTopic = currentTopics.find(function(item) {
        return topic.get('label') === item.get('label');
      });

      if (isTopic) {
        selectedDigitalObject.get('semMD.topics').removeObject(topic);
      } else {
        selectedDigitalObject.get('semMD.topics').pushObject(topic);
      }
    },

    removeTopic: function(topic) {
      var selectedDigitalObject = this.get('fileInfo');
      selectedDigitalObject.get('semMD.topics').removeObject(topic);
    },

    showTopic: function(topic) {
      console.log('showing topic details: ' + topic.get('label'));
    }
  }
});
