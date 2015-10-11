import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  modelUrl: function() {
    // FIXXME: connect to backend service! Currently this is a mocked implementation.
    let url = 'http://a360.co/1QhazXZ';
    return url;
  }.property('file')
});
