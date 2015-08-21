import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.metadata;

console.log('Connecting to "metadata/ifcm" API via: ' + apiConfig.host);

export
default ApplicationAdapter.extend({
  host: function() {
    var apiEndpoint = this.duraark.getAPIEndpoint('metadata');
    console.log('"duraark-metadata" endpoint: ' + apiEndpoint);
    return apiEndpoint;
  }.property().volatile(),

  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    return Ember.String.pluralize(camelized);
  }
});
