import Ember from 'ember';
import DURAARK from 'workbench-ui/bindings/duraark';
import ENV from '../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  seeds: null,

  initiateCrawl: function(crawler, topic) {
    var controller = this;

    var params = {
      user: 1,
      depth: 1
    };

    crawler.initiateCrawl(JSON.parse(JSON.stringify(topic)), params).then(function(result) {
      console.log('result for: ' + topic.label);
      console.log(JSON.stringify(result, null, 4));

      topic.crawlId = result.crawl_id;

      controller.get('session').save().then(function() {
        controller.send('addPendingAction');
        controller.askForCandidates(crawler, topic);
      });

    }).catch(function(err) {
      throw new Error(err);
    });
  },

  askForCandidates: function(crawler, topic) {
    var controller = this;
    console.log('asking for candidates...');
    controller.send('addPendingAction');
    crawler.getCandidates(topic.crawlId).then(function(candidates) {
      if (candidates.length) {
        console.log('candidates received: #' + candidates.length);
        // FIXXME: implement pagination and sorting by relevance to manage the huge amount of results!
        topic.candidates = candidates.slice(0, 100);
        // FIXXME: create a topic model to enable saving!
        controller.get('session').save().then(function() {
          console.log('stored candidates');
          controller.send('removePendingAction');

          topic.set('isLoading', false);
        });
      } else {
        console.log('No candidates yet, retrying in 60 seconds ...');
        setTimeout(function() {
          controller.askForCandidates(crawler, crawlId);
        }, 1000 * 60);
      }
    });
  },

  topics: function() {
    let allTopics = this.get('allTopics'),
      myTopics = this.get('session.config.sda.topics'),
      results = [];

      myTopics.forEach(function(myTopic) {
        var result = allTopics.find(function(topic, index, enumerable) {
          console.log('left: ' + myTopic + ' | ' + 'right: ' + topic.get('label'));
          return myTopic === topic.get('label');
        });
        results.push(result);
      });

      return results;
  }.property('config'),

  actions: {
    save: function() {
      var session = this.get('session'),
        url = sdaEndpoint.host + '/sessions/' + session.get('id'),
        controller = this;

      var digObjs = this.get('digitalObjects');

      digObjs.forEach(function(digObj) {
        digObj.get('semMD.topics').forEach(function(topic) {

          if (!topic.candidates.length) {
            var topicCrawler = new DURAARK.TopicCrawler({
                apiEndpoint: sdaEndpoint,
              }),
              crawlId = topic.crawlId;

            console.log('crawlId: ' + crawlId);

            if (crawlId === -1) {
              controller.initiateCrawl(topicCrawler, topic);
            } else {
              controller.askForCandidates(topicCrawler, topic);
            }
          }
        });
      });

      session.save();
    },

    next: function() {

      // FIXXME: check if everything is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('geometricenrichment', session);
    },

    back: function() {

      // FIXXME: check if everything is saved in the buildm-editor and display modal in case of unsaved changes!

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

        if (!topic.get('candidates').length) {
          topic.set('isLoading', true);
        };
      }

      this.send('save');

      // setTimeout(function() {
      //   topic.set('isLoading', false);
      // }, 1000);
    },

    removeTopic: function(digObj, topic) {
      // var selectedDigitalObject = this.get('fileInfo');
      // selectedDigitalObject.get('semMD.topics').removeObject(topic);
      digObj.get('semMD.topics').removeObject(topic);
      topic.toggleProperty('isSelected');
    },

    showTopic: function(topic) {
      console.log('showing topic details: ' + topic.get('label'));
    }
  }
});
