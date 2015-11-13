import Ember from 'ember';
import X3DViewer from '../utilities/x3d-viewer';

export default Ember.Component.extend({
  didInsertElement() {
      this._init();
    },

    urlChanged: function() {
      this._render();
    }.observes('url'),

    _init() {
      this._x3dViewer = new X3DViewer('X3D', this.get('url'), function() {
        // setTimeout(function() {
          document.getElementById('SCENE').runtime.showAll();
        // }, 1000);
      }, 'duraark', 'dummy', '700', false, false, false, false);

    },

    _render() {
      debugger
      this._x3dViewer.deleteScenes();
      this._x3dViewer.inlineScene(this.get('url'), 'duraark', function() {
        document.getElementById('SCENE').runtime.showAll();
      });
      // setTimeout(function() {
      //   let el = document.getElementById('SCENE');
      //   debugger;
      //   document.getElementById('SCENE').runtime.showAll();
      // }, 1000);
    },
});
