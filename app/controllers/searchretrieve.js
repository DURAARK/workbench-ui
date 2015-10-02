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

          topic.set('showLoadingSpinner', false);
        });
      } else {
        console.log('No candidates yet, retrying in 60 seconds ...');
        setTimeout(function() {
          controller.askForCandidates(crawler, crawlId);
        }, 1000 * 60);
      }
    });
  },

  actions: {
    setResult: function(result) {
      this.set('result', result);
    }
  }
});
