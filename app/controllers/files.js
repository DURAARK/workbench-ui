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

      console.log('showing details for file:   ' + file.get('path'));
      // this.set('selectedFile', file);

      var payload = JSON.stringify({
        file: {
          path: file.get('path'),
          type: file.get('type')
        }
      });

      $.ajax({
        type: "POST",
        url: 'http://localhost:5002/extract',
        data: payload,
        success: function(file) {
          console.log('juuh: ' + JSON.stringify(file, null, 4));
          controller.set('selectedFile', file);
          controller.set('isLoadingMetadata', false);
        },
        contentType: 'application/json',
        dataType: 'json'
      });
    }

  }
});
