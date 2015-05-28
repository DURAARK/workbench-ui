import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("workflows", function() {
    this.route('files', { path: "/files" });
    this.route('metadata', { path: "/metadata" });
    this.route('archiveexpert', { path: "/archiveexpert" });
    this.route('semanticenrichment', { path: "/semanticenrichment" });
    this.route('semanticenrichment-select-topic-1', { path: "/semanticenrichment-select-topic-1" });
    this.route('semanticenrichment-select-topic-1-added', { path: "/semanticenrichment-select-topic-1-added" });
    this.route('semanticenrichment-select-topic-2', { path: "/semanticenrichment-select-topic-2" });
    this.route('semanticenrichment-new-topic', { path: "/semanticenrichment-new-topic" });
    this.route('geometricenrichment', { path: "/geometricenrichment" });
    this.route('retrieval', { path: "/retrieval" });
    this.route('maintenance', { path: "/maintenance" });
  });

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
    this.route("virtuoso-query");
  });

  this.resource("preservation", function() {
    this.route('index', { path: "/" });
    this.route('show', { path: "/:id" });
  });
});

export default Router;
