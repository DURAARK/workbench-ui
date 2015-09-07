import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('overview', { path: "/overview" });
  this.route('files', { path: "/files/:id" });
  this.route('metadata', { path: "/metadata/:id" });
  this.route('semanticenrichment', { path: "/semanticenrichment/:id" });
  this.route('geometricenrichment', { path: "/geometricenrichment/:id" });
  this.route('digitalpreservation', { path: "/digitalpreservation/:id" });

  this.route('searchretrieve', { path: "/searchretrieve" });
  this.route('admin');
});

export default Router;
