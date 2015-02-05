import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("e57metadata");
  this.route("files");
  this.resource("preingest", function() {
  	this.route('index', { path: "/" });
  	this.route('show', { path: "/:id" });
  	this.route('create', { path: "/create" });
  });
  this.route("search");
  this.route("semenhance");
});

export default Router;
