import Ember from 'ember';

export default Ember.Component.extend(Droplet, {
  url: location.origin + '/upload',
  uploadImmediately: true
});
