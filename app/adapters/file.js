import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.files;
var host = apiConfig.host + ':' + apiConfig.port;

console.log('Connecting to "Files" API via: ' + host);

export
default ApplicationAdapter.extend({
    host: host,

    pathForType: function(type) {
        var camelized = Ember.String.camelize(type);
        return Ember.String.pluralize(camelized);
    }
});