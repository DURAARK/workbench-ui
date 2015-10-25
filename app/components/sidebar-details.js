import Ember from 'ember';

export default Ember.Component.extend({
  // buildingChanged: Ember.on('init', Ember.observer('building', function() {
  //   let building = this.get('building'),
  //     uri = this.get('uri'),
  //     controller = this;
  //
  //   console.log('[sidebar-details] Retrieving metadata for: ' + uri)
  //
  //   this.duraark.getPhysicalAsset(uri).then(function(building) {
  //     console.log('buildling: ' + JSON.stringify(building, null, 4));
  //     controller.set('buildingFull', building);
  //   });
  // }));
});
