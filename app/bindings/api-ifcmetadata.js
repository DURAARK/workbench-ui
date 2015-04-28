import Ember from 'ember';
import MetadataExtractionAPIBase from './mixins/api-metadataextraction';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.ifcmetadata;

export
default Ember.Object.extend(MetadataExtractionAPIBase, {
    // host: host,
    jobsEndpoint: apiConfig.jobsEndpoint,
    extractEndpoint: apiConfig.extractEndpoint,
    responseKey: apiConfig.responseKey
});