import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
      retry() {
        let removeTool = true,
          tool = this.get('tool'),
          filename = this.get('tool.filename');

        this.sendAction('onRetry', tool, filename, removeTool, true);
      },

      download() {
        let url = this.duraark.getAPIEndpoint('geometricEnrichment') + this.get('tool.downloadUrl');
        downloadURL(url, 'downloadUrl');
      }
  }
});

function downloadURL(url, frameId) {
  var iframe = document.getElementById(frameId);
  if (iframe === null) {
    iframe = document.createElement('iframe');
    iframe.id = frameId;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  iframe.src = url;
};
