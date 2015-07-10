import Ember from 'ember';
import ENV from '../config/environment';
import DURAARK from 'workbench-ui/bindings/duraark';

var topicCrawlerApiEndpoint = ENV.DURAARKAPI.topicCrawler.host;

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

  initiateCrawls: function(topics) {
    var topicCrawler = new DURAARK.TopicCrawler({
      apiEndpoint: topicCrawlerApiEndpoint,
    });

    topicCrawler.initiateCrawl(JSON.parse(JSON.stringify(topics)));

    this.send('addPendingAction');
  },

  actions: {
    save: function() {
      var session = this.get('session'),
        url = 'http://localhost:5001/sessions/' + session.get('id'),
        controller = this;

      var digObjs = this.get('digitalObjects');

      digObjs.forEach(function(digObj) {
        var model = session.get('digitalObjects').find(function(item) {
          return item.label === digObj.get('label');
        });

        if (!model) {
          throw new Error('should not happen, investigate!');
        }

        controller.initiateCrawls(digObj.get('semMD.topics'));

        // Convert Ember.Object to plain JSON before saving:
        var semMD = JSON.parse(JSON.stringify(digObj.get('semMD')));
        model.semMD = semMD;
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
