import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.e57metadata;
var host = apiConfig.host;// + ':' + apiConfig.port;

console.log('Connecting to "e57metadata" API via: ' + host);

export
default ApplicationAdapter.extend({
    host: host
});