import Ember from 'ember';
import ENV from '../config/environment';

export
function initialize(container, application) {
    var host;

	    // Check if an overide host is specified. If so, set it as apiEndpoint, otherwise
    // use the current location as base URL for the API:
    if (ENV.apiConfig.overrideHost) {
        host = ENV.apiConfig.overrideHost;
    } else {
        var host = window.location.host,
            protocol = window.location.protocol,
            apiVersion = 'v0.1',
            apiEndpoint = protocol + '//' + host + '/api/' + apiVersion;

    }
    var APIConfig = Ember.Object.extend({
        host: host
    });

    application.register('api-config:main', APIConfig);

    application.inject('adapter', 'apiConfig', 'api-config:main');
    application.inject('route', 'apiConfig', 'api-config:main');
    application.inject('controller', 'apiConfig', 'api-config:main');

    console.log('DURAARK API endpoint host: ' + host);
}

export
default {
    name: 'api-config',
    initialize: initialize
};