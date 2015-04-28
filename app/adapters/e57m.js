import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'e57m',

	endpoint: function() {
		return ENV.DURAARKAPI.sessions.endpoint;
	}.property()
});