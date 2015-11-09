import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    roomClicked(roomName) {
        alert('Showing data for: ' + roomName);
      },

      retry() {
        let removeTool = true,
          tool = this.get('tool'),
          filename = this.get('tool.filename');

        this.sendAction('onRetry', tool, filename, removeTool);
      },

      downloadBIM() {
        let url = this.duraark.getAPIEndpoint('geometricEnrichment') + this.get('tool.bimDownloadUrl');
        console.log('Download-URL: ' + url);

        downloadURL(url, 'bimDownloader');
      },

      downloadWalls() {
        let url = this.duraark.getAPIEndpoint('geometricEnrichment') + this.get('tool.wallsDownloadUrl');
        console.log('Download-URL: ' + url);

        // FIXXME: the download does not start because of the json mimetype.
        // downloadURL(url, 'wallsDownloader');

        // We are showing the file in a new tab instead ...
        window.open(url, '_blank');
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
