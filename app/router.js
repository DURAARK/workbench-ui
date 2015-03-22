import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("preingest", function() {
  	this.route('index', { path: "/" });
  	this.route('show', { path: "/:id" });
  	this.route('create', { path: "/create" });
  });

  this.resource("editor", { path: "/editor"}, function() {
    this.resource('files', { path: "/files/:id" });
    this.resource('metadata', { path: "/metadata/:id" }, function() {
      this.route('physicalasset', { path: "/physicalasset/:physicalAsset_id"});
      this.route('digitalobject', { path: "/digitalobject/:digitalObject_id"});
      this.route('e57m', { path: "/e57m/:id"});
      this.route('ifcm', { path: "/ifcm/:id"});
    });

    this.resource("semanticenrichment", { path: "/semanticenrichment/:id" });
    this.route("geometric-enrichment", { path: "/geometricenrichment/:id" });
  });

  this.route("search");

  this.route("maintenance", function() {
    this.route("interlink");
    this.route("sdo-graph-explorer");
  });

  this.resource("preservation", function() {
    this.route('index', { path: "/" });
    this.route('show', { path: "/:id" });
  });
});

export default Router;
