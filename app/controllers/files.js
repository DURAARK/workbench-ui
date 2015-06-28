import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    toggleSelection: function(file) {
      file.toggleProperty('isSelected');

      if (file.get('isSelected')) {
        console.log('selected file:   ' + file.get('path'));
      } else {
        console.log('deselected file: ' + file.get('path'));
      }
    },

    showDetails: function(file) {
      var controller = this;

      controller.set('isLoadingMetadata', true);

      // NOTE: requests metadata for the given file via the
      //       'metadata-extraction' service
      var md = controller.store.createRecord('metadatum');
      md.set('path', file.get('path'));
      md.set('type', file.get('type'));

      md.save().then(function(md) {
        console.log('showing details for file:   ' + file.get('path'));
        // console.log('md: ' + JSON.stringify(md, null, 4));
        controller.set('fileInfo', md);
        controller.set('isLoadingMetadata', false);
      });
    }

  }
});
