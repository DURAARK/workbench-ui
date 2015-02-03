import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("e57metadata");
  this.route("files");
  this.resource("sessions", function() {
  	this.route('index', { path: "/" });
  	this.route('show', { path: "/:id" });
  });
  this.route("search");
  this.route("maintenance");
});

export default Router;
