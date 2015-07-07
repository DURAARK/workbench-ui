import Ember from 'ember';

export default Ember.Controller.extend({
  selectedFiles: [],
  fileInfo: null,

  fileInfoShortName: function() {
    if (!this.get('fileInfo')) return 'No file selected';

    var path = this.get('fileInfo.path');
    return path.replace('/duraark-storage/files/', ''); // FIXXME!
  }.property('fileInfo'),

  actions: {
    save: function() {
      console.log('Selected files:');
      this.get('selectedFiles').forEach(function(file) {
        console.log('  * ' + file.get('path'));
      });
    },

    toggleSelection: function(file) {
      file.toggleProperty('isSelected');

      var files = this.get('selectedFiles');

      if (file.get('isSelected')) {
        files.push(file);
        // console.log('selected file:   ' + file.get('path'));
      } else {
        files.removeObject(file);
        // console.log('deselected file:   ' + file.get('path'));
      }

      // console.log('Currently selected files:');
      // files.forEach(function(file) {
      //   console.log('  * ' + file.get('path'));
      // });
    },

    showDetails: function(file) {
      var controller = this;

      // Reset details pane:
      controller.set('errors', null);
      controller.set('fileInfo', null);
      controller.set('isLoadingMetadata', true);

      // TODO: check local store before sending network request!
      // this.store.all('metadatum', {
      //   path: file.get('path'),
      //   type: file.get('type')
      // }).then(function(md) {
      //   debugger;
      //   if (md.length) {
      //     controller.set('fileInfo', md[0]);
      //     controller.set('isLoadingMetadata', false);
      //   }
      // });

      // NOTE: requests metadata for the given file via the
      //       'metadata-extraction' service
      // FIXXME: utilize store as cache, do not request every time!
      var md = controller.store.createRecord('metadatum');
      md.set('path', file.get('path'));
      md.set('type', file.get('type'));

      md.save().then(function(md) {
        var errors = md.get('extractionErrors');

        console.log('showing details for file:   ' + file.get('path'));
        // console.log('md: ' + JSON.stringify(md, null, 4));
        controller.set('fileInfo', md);

        if (errors) {
          controller.set('errors', errors);
        }

        controller.set('isLoadingMetadata', false);
      });
    }
  }
});
