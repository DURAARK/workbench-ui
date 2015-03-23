import Ember from 'ember';
import SIPGeneratorAPI from 'workbench-ui/bindings/api-sipgenerator';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.sipgenerator;
var host = apiConfig.host;

function _post(url, data) {
	return new Ember.RSVP.Promise(function(resolve, reject) {
		function handler(data, status, jqxhr) {
			if (jqxhr.statusText === 'OK') {
				resolve(data);
			} else {
				reject(new Error('[MetadataExtractionBase::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
			}
		}

		Ember.$.post(url, data, handler);
	});
}

export default Ember.Component.extend({
	downloadUrl: '',
	isLoading: false,
	creationFinished: false,

	actions: {
		createRosettaSIP: function() {
			var files = this.get('stage.files'),
				controller = this;

			console.log('creating sip with files: #' + files.get('length'));

			controller.set('isLoading', true);

			var poFiles = [];
			files.forEach(function(file) {
				poFiles.push({
					path: file.get('path')
				});
			});

			var url = host + '/sip/build';

			console.log('connection to url: ' + url);
			_post(url, {
				files: poFiles
			}).then(function(data) {
				controller.set('downloadUrl', host + data.url);
				controller.set('isLoading', false);
				controller.set('creationFinished', true);
			});
		}
	}
});