import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'property',

	endpoint: function() {
		return ENV.DURAARKAPI.sda.endpoint;
	}.property()
});