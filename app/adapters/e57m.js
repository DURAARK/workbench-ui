import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.e57metadata;
console.log('Connecting to "e57metadata" API via: ' + apiConfig.host);

export
default ApplicationAdapter.extend({
    host: apiConfig.host
});