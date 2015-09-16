import Ember from 'ember';

export default Ember.Component.extend({
  buildingChanged: Ember.on('init', Ember.observer('building', function() {
    let building = this.get('building'),
      uri = this.get('uri'),
      controller = this;

    console.log('[sidebar-details] Retrieving metadata for: ' + uri)

    this.duraark.getPhysicalAsset(uri).then(function(building) {
      controller.set('buildingFull', building);
    });
  }))
});
