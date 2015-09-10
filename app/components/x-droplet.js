import Ember from 'ember';

export default Ember.Component.extend(Droplet, {
  url: 'http://localhost:5011/files/upload',
  // url: 'http://localhost:5014/sessions/uploadFile'

  hooks: {
    didUpload: function() {
      var controller = this;
      var files = this.get('uploadResponse.files');
      controller.sendAction('onFilesUploaded', files);
    }
  }
});
