import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    roomClicked(roomName) {
        alert('Showing data for: ' + roomName);
      },

      retry() {
        var that = this;

        this.set('tool.isLoading', true);
        this.set('tool.hasError', false);
        this.set('tool.errorText', null);
        this.set('tool.hasData', false);

        this.duraark.getIFCReconstruction({
          inputFile: this.get('tool.filename'),
          restart: true
        }).then(function(runState) {
          console.log('runState: ' + JSON.stringify(runState, null, 4));

          if (runState.status === 'finished') {
            console.log('IFC reconstruction finished for file: ' + runState.inputFile);
            that.set('tool.isLoading', false);
            that.set('tool.hasError', false);
            that.set('tool.hasData', true);
            that.set('tool.bimDownloadUrl', runState.bimDownloadUrl);
            that.set('tool.wallsDownloadUrl', runState.wallsDownloadUrl);
          }

          if (runState.status === 'error') {
            // Give the user some time to see that a retry is happening...
            setTimeout(function() {
              that.set('tool.hasError', true);
              that.set('tool.isLoading', false);
              that.set('tool.errorText', runState.errorText);
              that.set('tool.hasData', false);
            }, 3000);
          }

          if (runState.status === 'pending') {
            that.set('tool.isLoading', true);
            that.set('tool.hasError', false);
            that.set('tool.hasData', false);

            var timer = setInterval(function() {
              console.log('requesting runState status for file: ' + runState.inputFile);
              duraark.getIFCReconstruction({
                inputFile: filename,
                restart: false
              }).then(function(runState) {
                console.log('runState: ' + JSON.stringify(runState, null, 4));

                if (runState.status === 'finished') {
                  console.log('IFC reconstruction finished for file: ' + runState.inputFile);
                  that.set('tool.isLoading', false);
                  that.set('tool.hasError', false);
                  that.set('tool.hasData', true);
                  that.set('tool.bimDownloadUrl', runState.bimDownloadUrl);
                  that.set('tool.wallsDownloadUrl', runState.wallsDownloadUrl);
                  clearInterval(timer);
                }

                if (runState.status === 'pending') {
                  that.set('tool.isLoading', true);
                  that.set('tool.hasError', false);
                  that.set('tool.hasData', false);
                }

                if (runState.status === 'error') {
                  that.set('tool.hasError', true);
                  that.set('tool.isLoading', false);
                  that.set('tool.hasData', false);
                  clearInterval(timer);
                }
              });
            }, 10000);
          }
        });
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
