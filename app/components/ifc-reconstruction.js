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
            that.set('tool.downloadUrl', runState.downloadUrl);
            that.set('tool.downloadUrlWallJSON', runState.downloadUrlWallJSON);
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

      download() {
        let url = this.duraark.getAPIEndpoint('geometricEnrichment') + this.get('tool.downloadUrl');
        console.log('Download-URL: ' + url);

        downloadURL(url);
      },

      downloadWallJSON() {
        let url = this.duraark.getAPIEndpoint('geometricEnrichment') + this.get('tool.downloadUrlWallJSON');
        console.log('Download-URL: ' + url);

        downloadURL(url);
      }
  }
});

function downloadURL(url) {
  var hiddenIFrameID = 'hiddenDownloader',
    iframe = document.getElementById(hiddenIFrameID);
  if (iframe === null) {
    iframe = document.createElement('iframe');
    iframe.id = hiddenIFrameID;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  iframe.src = url;
};
