import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  modelUrl: function() {
    // FIXXME: connect to backend service! Currently this is a mocked implementation.
    // let url = 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/viewer/pointcloud';
    // let url = 'http://juliet.cgv.tugraz.at/viewer/pointcloud';
    let url = 'http://juliet.cgv.tugraz.at/viewer/pointcloud';
    return url;
  }.property('file')
});
