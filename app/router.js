import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('files', { path: "/files/local/:id" });
  this.route('files-sda', { path: "/files/sda/:id" });
  this.route('metadata', { path: "/metadata/:id" });
  this.route('semanticenrichment', { path: "/semanticenrichment/:id" });
  // this.route('geometricenrichment', { path: "/geometricenrichment/:id" });
  this.route('sipgeneration', { path: "/sipgeneration/:id" });
});

export default Router;
