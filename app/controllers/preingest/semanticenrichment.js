import Ember from 'ember';
import DURAARK from 'workbench-ui/bindings/duraark';
import ENV from '../../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  selectedPhysicalAsset: null,

  initiateCrawl: function(crawler, topic) {
    var controller = this;

    var params = {
      user: 1,
      depth: 1
    };

    crawler.initiateCrawl(JSON.parse(JSON.stringify(topic)), params).then(function(result) {
      console.log('result for: ' + topic.label);
      // console.log(JSON.stringify(result, null, 4));

      topic.candidates = result;

      controller.get('session').save().then(function() {
        topic.set('showLoadingSpinner', false);
        // controller.askForCandidates(crawler, topic);
      });

    }).catch(function(err) {
      throw new Error(err);
    });
  },

  askForCandidates: function(crawler, topic) {
    var controller = this;
    console.log('asking for candidates...');
    crawler.getCandidates(topic.crawlId).then(function(candidates) {
      candidates = JSON.parse(candidates);
      if (candidates.length) {
        console.log('candidates received: #' + candidates.length);
        // FIXXME: implement pagination and sorting by relevance to manage the huge amount of results!
        topic.candidates = candidates.slice(0, 100);
        // FIXXME: create a topic model to enable saving!
        controller.get('session').save().then(function() {
          console.log('stored candidates');

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

  topics: function() {
    // Bail out if no digital object is selected:
    if (!this.get('selectedPhysicalAsset')) {
      return;
    }

    let allTopics = this.get('allTopics'),
      configuredTopics = this.get('session.config.sda.topics'),
      selectedPhysicalAsset = this.get('selectedPhysicalAsset'),
      paTopics = selectedPhysicalAsset.get('semMD.topics'),
      shownTopics = [];

    configuredTopics.forEach(function(myTopic) {
      var topic = allTopics.find(function(topic, index, enumerable) {
        return myTopic === topic.get('label');
      });
      shownTopics.push(topic);
    });

    // Set selection state based on selected file:
    shownTopics.forEach(function(shownTopic, index, enumerable) {
      var curFileTopic = paTopics.find(function(fileTopic, index, enumerable) {
        return fileTopic.label === shownTopic.get('label');
      });

      // If the file contains the topic from the selection set the selection
      // state in the shown topic accordingly:
      if (curFileTopic) {
        shownTopic.set('isSelected', true);
      } else {
        shownTopic.set('isSelected', false);
      }
    });

    return shownTopics;
  }.property('session.config', 'selectedPhysicalAsset.semMD.topics.[]'),

  togglePhysicalAssetSelection: function(pa) {
    var flag = pa.get('isSelected');

    this.get('physicalAssets').forEach(function(obj) {
      obj.set('isSelected', false);
    });

    pa.set('isSelected', !flag);

    this.set('selectedPhysicalAsset', pa);

    if (pa.get('isSelected') === false) {
      this.set('selectedPhysicalAsset', null);
    }
  },

  selectPhysicalAsset: function(pa) {
    var flag = pa.get('isSelected');

    if (flag) return;

    this.get('physicalAssets').forEach(function(obj) {
      obj.set('isSelected', false);
    });

    pa.set('isSelected', true);
    this.set('selectedPhysicalAsset', pa);
  },

  unselectPhysicalAssets: function() {
    this.get('physicalAssets').forEach(function(obj) {
      obj.set('isSelected', false);
    });
  },

  actions: {
    save: function() {
      var session = this.get('session');
      session.save().catch(function(err) {
        throw new Error(err);
      });
    },

    next: function() {
      var session = this.get('session'),
        controller = this;

      if (session.get('physicalAssets')) {
        session.get('physicalAssets').forEach(function(pa) {
          // FIXXME: remove ember-data and plain javascript models ASAP!
          if (_.isFunction(pa.get)) {
            let semMD = pa.get('semMD'),
              tmp = JSON.parse(JSON.stringify(semMD));
            pa.set('semMD', tmp);
          }
        });
      }

      session.save().then(function(session) {
        if (session.get('physicalAssets')) {
          controller.unselectPhysicalAssets();
        };
        controller.transitionToRoute('preingest.digitalpreservation', session);
      }).catch(function(err) {
        throw new Error(err);
      });
    },

    back: function() {
      var session = this.get('session'),
        controller = this;

      if (session.get('physicalAssets')) {
        session.get('physicalAssets').forEach(function(pa) {
          // FIXXME: remove ember-data and plain javascript models ASAP!
          if (_.isFunction(pa.get)) {
            let semMD = pa.get('semMD'),
              tmp = JSON.parse(JSON.stringify(semMD));
            pa.set('semMD', tmp);
          }
        });
      }

      session.save().then(function(session) {
        controller.transitionToRoute('preingest.geometricenrichment', session);
      }).catch(function(err) {
        throw new Error(err);
      });
    },

    showTopicSelection: function(pa) {
      this.set('topic', null);
      this.set('selectedPhysicalAsset', pa);
      this.togglePhysicalAssetSelection(pa);
    },

    showEnrichmentCandidates: function(pa, topic) {
      this.set('topic', topic);
      this.set('selectedPhysicalAsset', pa);
      this.selectPhysicalAsset(pa);
    },

    clickedTopic: function(topic) {
      var selectedPhysicalAsset = this.get('selectedPhysicalAsset'),
        currentTopics = selectedPhysicalAsset.get('semMD.topics');

      var selectedTopic = currentTopics.find(function(item) {
        return topic.get('label') === item.label;
      });

      if (selectedTopic) {
        currentTopics.removeObject(selectedTopic);
      } else {
        // Create new instance of topic to be added to 'semMD.topics'. It is not
        // possible to directly use the 'topic' instance, as multiple files can
        // have the same topic assigned.
        var t = Ember.Object.create({
          label: topic.get('label'),
          description: topic.get('description'),
          seeds: topic.get('seeds'),
          crawlId: topic.get('crawlId'),
          candidates: topic.get('candidates'),
          isLoading: false
        });
        currentTopics.pushObject(t);

        if (!t.get('candidates').length) {
          t.set('showLoadingSpinner', true);

          if (!t.candidates.length) {
            var topicCrawler = new DURAARK.TopicCrawler({
                apiEndpoint: sdaEndpoint,
              }),
              crawlId = t.crawlId;

            // console.log('crawlId: ' + crawlId);

            if (crawlId === -1) {
              this.initiateCrawl(topicCrawler, t);
            } else {
              this.askForCandidates(topicCrawler, t);
            }
          }
        }
      }
    },

    removeTopic: function(pa, topic) {
      this.set('topic', null);
      this.set('selectedPhysicalAsset', pa);
      this.selectPhysicalAsset(pa);

      pa.get('semMD.topics').removeObject(topic);
    },

    closeToolUI() {
      this.set('topic', null);
    }
  }
});
