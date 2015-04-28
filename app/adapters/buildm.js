import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'buildm',
	
	endpoint: function() {
		return ENV.DURAARKAPI.sessions.endpoint;
	}.property()
});