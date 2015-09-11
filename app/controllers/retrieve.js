import Ember from 'ember';

export default Ember.Controller.extend({
actions: {
  showInViewer(buildm) {
    console.log('buidlmasdfkljasdf: ' + JSON.stringify(buildm, null, 4));
    this.set('selectedBuildm', buildm);
  }
}
});
