import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.sda;
console.log('Connecting to "sda" API via: ' + apiConfig.host);

export
default ApplicationAdapter.extend({
    host: apiConfig.host
});