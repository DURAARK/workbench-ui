import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    var canvas = document.getElementById('cv');
    var viewer = new JSC3D.Viewer(canvas);
    viewer.setParameter('SceneUrl', '/models/bank.obj');
    viewer.setParameter('InitRotationX', 0);
    viewer.setParameter('InitRotationY', 0);
    viewer.setParameter('InitRotationZ', 0);
    viewer.setParameter('ModelColor', '#CAA618');
    viewer.setParameter('BackgroundColor1', '#E5D7BA');
    viewer.setParameter('BackgroundColor2', '#383840');
    viewer.setParameter('RenderMode', 'textureflat');
    viewer.setParameter('MipMapping', 'on');
    viewer.setParameter('Renderer', 'webgl');
    viewer.init();
    viewer.update();
  }
});
