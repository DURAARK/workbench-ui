import Ember from 'ember';
import ApplicationAdapter from './application';
import ENV from '../config/environment';

export
default ApplicationAdapter.extend({
	label: 'search-item',

	endpoint: function() {
		return ENV.DURAARKAPI.searchItems.endpoint;
	}.property()
});