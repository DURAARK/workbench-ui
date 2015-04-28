import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'file',

	endpoint: function() {
		return ENV.DURAARKAPI.files.endpoint;
	}.property()
});