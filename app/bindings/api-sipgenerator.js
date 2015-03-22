import Ember from 'ember';
import MetadataExtractionAPIBase from './mixins/api-metadataextraction';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.sipgenerator;
var host = apiConfig.host;

console.log('[API:sipgeneration] endpoint: ' + host);
console.log('[API:sipgeneration] config:   ' + JSON.stringify(apiConfig, null, 4));

export
default Ember.Object.extend(MetadataExtractionAPIBase, {
    host: host,
    jobsEndpoint: apiConfig.jobsEndpoint,
    extractEndpoint: apiConfig.extractEndpoint,
    responseKey: apiConfig.responseKey
});