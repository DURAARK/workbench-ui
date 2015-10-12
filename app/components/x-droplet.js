import Ember from 'ember';

export default Ember.Component.extend(Droplet, {
  url: function() {
    return this.duraark.getAPIEndpoint('sessions') + '/uploads/upload';
  },
  // url: 'http://localhost/api/v0.7/sessions/files/upload',
  // url: 'http://localhost:5011/uploads/upload',
  // see http://craftcms.stackexchange.com/questions/2328/413-request-entity-too-large-error-with-uploading-a-file

  hooks: {
    didUpload: function() {
      var controller = this;
      var files = this.get('uploadResponse.files');
      controller.sendAction('onFilesUploaded', files);
    }
  }
});
