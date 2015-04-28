import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'digital-object',

	endpoint: function() {
		return ENV.DURAARKAPI.sessions.endpoint;
	}.property()
});