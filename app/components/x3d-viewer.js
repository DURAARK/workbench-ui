import Ember from 'ember';
import X3DViewer from '../utilities/x3d-viewer';

export default Ember.Component.extend({
  inlineUrl: null,

  didInsertElement() {
    // this._init();
    x3dom.reload();
    setTimeout(function() {
      document.getElementById('SCENE').runtime.showAll();
    }, 300);
  },

  inlineUrlChanged: function() {
    this._render();
    // x3dom.reload();
  }.observes('inlineUrl'),

  _init() {
    this._x3dViewer = new X3DViewer('x3d', this.get('inlineUrl'), function() {
      // setTimeout(function() {
      document.getElementById('SCENE').runtime.showAll();
      // }, 1000);
    }, 'duraark', 'dummy', '700', false, false, false, false);

  },

  _render() {
    // this._x3dViewer.deleteScenes();
    if (!this._x3dViewer) {
      this._init();
    }

    this._x3dViewer.inlineScene(this.get('inlineUrl'), 'duraark', function() {
      document.getElementById('SCENE').runtime.showAll();
    });
    // setTimeout(function() {
    //   let el = document.getElementById('SCENE');
    //   debugger;
    //   document.getElementById('SCENE').runtime.showAll();
    // }, 1000);
  },
});
