import Ember from 'ember';
import DURAARK from 'workbench-ui/bindings/duraark';

export default Ember.Component.extend({
  selectedCandidate: null,

  actions: {
    click(topic) {
        topic.toggleProperty('isSelected');
        this.sendAction('click', topic);
      },

      selectCandidate(candidate) {
        this.set('selectedCandidate', candidate);
      },

      unselectCandidate() {
        this.set('selectedCandidate', null);
      },

      removeCandidate(candidate) {
        let topic = this.get('topic');
        topic.candidateSelection.removeObject(candidate);
        this.send('unselectCandidate');
      },

      reloadCandidates() {
        let topic = this.get('topic'),
        topicCrawler = new DURAARK.TopicCrawler({
          apiEndpoint: this.duraark.getAPIEndpoint('sda')
        });

        let candidates = topicCrawler.getCandidates(topic.crawlId);
        candidates = [{
          entity: 'http://blablub.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        },{
          entity: 'http://biblob.at',
          score: 1
        }];
        this.set('topic.candidateSelection', candidates);
      }
  }
});
