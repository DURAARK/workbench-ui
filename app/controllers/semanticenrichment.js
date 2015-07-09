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
    save: function() {
      var session = this.get('session'),
        url = 'http://localhost:5001/sessions/' + session.get('id');

      var digObjs = this.get('digitalObjects');

      digObjs.forEach(function(digObj) {
        var model = session.get('digitalObjects').find(function(item) {
          return item.label === digObj.get('label');
        });

        if (!model) {
          throw new Error('should not happen, investigate!');
        }

        var bla = JSON.parse(JSON.stringify(digObj.get('semMD')));
        // model.semMD = digObj.get('semMD');
        model.semMD = bla;
      });

      session.save();

      // post(url, session.toJSON()).then(function(session) {
      //   console.log('Saved session');
      // });
    },

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

    showTopicSelection: function(digObj) {
      this.set('fileInfo', digObj);
    },

    showSelectedTopic: function(digObj, topic) {
      this.set('fileInfo', null);
      this.set('topic', topic);
    },

    clickedTopic: function(topic) {
      var selectedDigitalObject = this.get('fileInfo'),
        currentTopics = selectedDigitalObject.get('semMD.topics');

      var isTopic = currentTopics.find(function(item) {
        return topic.get('label') === item.label;
      });

      if (isTopic) {
        currentTopics.removeObject(topic);
      } else {
        currentTopics.pushObject(topic);
      }
    },

    removeTopic: function(digObj, topic) {
      // var selectedDigitalObject = this.get('fileInfo');
      // selectedDigitalObject.get('semMD.topics').removeObject(topic);
      digObj.get('semMD.topics').removeObject(topic);
    },

    showTopic: function(topic) {
      console.log('showing topic details: ' + topic.get('label'));
    }
  }
});
