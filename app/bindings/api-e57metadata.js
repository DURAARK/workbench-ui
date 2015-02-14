import Ember from 'ember';
import MetadataExtractionAPIBase from './mixins/api-metadataextraction';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.e57metadata;
var host = apiConfig.host;// + ':' + apiConfig.port;

console.log('[API:e75metadata] endpoint: ' + host);
console.log('[API:e75metadata]    config: ' + JSON.stringify(apiConfig, null, 4));

export
default Ember.Object.extend(MetadataExtractionAPIBase, {
    host: host,
    jobsEndpoint: apiConfig.jobsEndpoint,
    extractEndpoint: apiConfig.extractEndpoint,
    responseKey: apiConfig.responseKey
});