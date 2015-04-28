import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.ifcmetadata;

export
default ApplicationAdapter.extend({
	label: 'metadatastage',

	endpoint: function() {
		return ENV.DURAARKAPI.sessions.endpoint;
	}.property()
});