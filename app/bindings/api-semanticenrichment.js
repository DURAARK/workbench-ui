import Ember from 'ember';
import MetadataExtractionAPIBase from './mixins/api-metadataextraction';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.semanticenrichment;
var host = apiConfig.host;

console.log('[API:semanticenrichment] endpoint: ' + host);
console.log('[API:semanticenrichment]    config: ' + JSON.stringify(apiConfig, null, 4));

export
default Ember.Object.extend(MetadataExtractionAPIBase, {
    host: host,
    jobsEndpoint: apiConfig.jobsEndpoint,
    extractEndpoint: apiConfig.extractEndpoint,
    responseKey: apiConfig.responseKey
});