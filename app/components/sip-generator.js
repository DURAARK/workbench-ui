import Ember from 'ember';
import SIPGeneratorAPI from 'workbench-ui/bindings/api-sipgenerator';

export default Ember.Component.extend({
	actions: {
		createRosettaSIP: function() {
			var files = this.get('stage.files');
			console.log('creating sip with files: #' + files.get('length'));

			var sipGeneratorAPI = new SIPGeneratorAPI();

			var poFiles = [];
			files.forEach(function(file) {
				poFiles.push(JSON.parse(JSON.stringify(file)));
			});

			sipGeneratorAPI.getMetadataFor({
				path: {
					magicCookie: true,
					files: poFiles
				}
			}).then(function(res) {
				alert('Download URL: ' + res.downloadUrl);
			});
		}
	}
});