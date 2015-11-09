import Ember from 'ember';
import DURAARK from 'workbench-ui/bindings/duraark';

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

      topic.candidateSelection = result;

      controller.get('session').save().then(function() {
        topic.set('showLoadingSpinner', false);
        // controller.askForCandidates(crawler, topic);
      });

    }).catch(function(err) {
      throw new Error(err);
    });
  },

  askForCandidates: function(crawler, topic) {
    var controller = this,
      eventId = new Date(); // FIXXME: find a better more robust solution for a unique id. This will work for now...

    console.log('asking for candidates...');

    controller.send('addPendingEvent', {
      label: 'Requesting context information: ' + topic.get('label'),
      displayType: 'info',
      id: eventId
    });

    crawler.getCandidates(topic.crawlId).then(function(candidates) {
      candidates = JSON.parse(candidates);
      if (candidates.length) {
        console.log('candidates received: #' + candidates.length);
        // FIXXME: implement pagination and sorting by relevance to manage the huge amount of results!
        topic.set('candidateSelection', candidates.slice(0, 50).sortBy('score').reverse());
        topic.set('isLoading', false);
        topic.set('hasData', true);
        // FIXXME: create a topic model to enable saving!
        controller.get('session').save().then(function() {
          console.log('stored candidates');

          topic.set('showLoadingSpinner', false);

          controller.send('addFinishedEvent', {
            label: 'Retrieved context information: ' + topic.get('label'),
            displayType: 'success',
            id: eventId
          });
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
      selectedPhysicalAsset = this.get('selectedPhysicalAsset'),
      paTopics = selectedPhysicalAsset.get('semTopics');

    // configuredTopics.forEach(function(myTopic) {
    //   var topic = allTopics.find(function(topic, index, enumerable) {
    //     return myTopic === topic.get('label');
    //   });
    //   configuredTopics.push(topic);
    // });

    // Set selection state based on selected file:
    allTopics.forEach(function(curTopic, index, enumerable) {
      var curFileTopic = paTopics.find(function(fileTopic, index, enumerable) {
        return fileTopic.label === curTopic.get('label');
      });

      // If the file contains the topic from the selection set the selection
      // state in the shown topic accordingly:
      if (curFileTopic) {
        curTopic.set('isSelected', true);
      } else {
        curTopic.set('isSelected', false);
      }
    });

    return allTopics;
  }.property('session.config', 'selectedPhysicalAsset.semTopics.[]'),

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

      // if (session.get('physicalAssets')) {
      //   session.get('physicalAssets').forEach(function(pa) {
      //     // FIXXME: remove ember-data and plain javascript models ASAP!
      //     if (_.isFunction(pa.get)) {
      //       let semMD = pa.get('semMD'),
      //         tmp = JSON.parse(JSON.stringify(semMD));
      //       pa.set('semMD', tmp);
      //     }
      //   });
      // }

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

      // if (session.get('physicalAssets')) {
      //   session.get('physicalAssets').forEach(function(pa) {
      //     // FIXXME: remove ember-data and plain javascript models ASAP!
      //     if (_.isFunction(pa.get)) {
      //       let semMD = pa.get('semMD'),
      //         tmp = JSON.parse(JSON.stringify(semMD));
      //       pa.set('semMD', tmp);
      //     }
      //   });
      // }

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
        currentTopics = selectedPhysicalAsset.get('semTopics');

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
          candidateSelection: topic.get('candidates'),
          isLoading: true,
          hasError: false,
          hasData: false,
        });
        currentTopics.pushObject(t);

        if (!t.get('candidateSelection').length) {
          t.set('showLoadingSpinner', true);

          if (!t.candidateSelection.length) {
            var topicCrawler = new DURAARK.TopicCrawler({
                apiEndpoint: this.duraark.getAPIEndpoint('sda'),
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

      pa.get('semTopics').removeObject(topic);
    },

    closeToolUI() {
      this.set('topic', null);
    }
  }
});
