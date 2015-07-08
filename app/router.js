import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('files', { path: "/files/local/:id" });
  this.resource('files-sda', { path: "/files/sda/:id" });
  this.resource('metadata', { path: "/metadata/:id" });
  this.resource('semanticenrichment', { path: "/semanticenrichment/:id" });
});

export default Router;
