import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    roomClicked(roomName) {
        alert('Showing data for: ' + roomName);
      },

      retry() {
        var that = this;

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
          }

          if (runState.status === 'error') {
            that.set('tool.hasError', true);
            that.set('tool.isLoading', false);
            that.set('tool.errorText', runState.errorText);
            that.set('tool.hasData', false);
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
                  t.hasError('hasError', false);
                  clearInterval(timer);
                }

                if (runState.status === 'pending') {
                  that.set('tool.isLoading', true);
                  that.set('tool.hasError', false);
                }

                if (runState.status === 'error') {
                  that.set('tool.hasError', true);
                  that.set('tool.isLoading', false);
                  clearInterval(timer);
                }
              });
            }, 10000);
          }
        });
      }
  }
});
