import Ember from 'ember';

export default Ember.Component.extend({
  buildingChanged: Ember.observer('building', function() {
    let building = this.get('building');
    debugger;
    console.log('[sidebar-details] Retrieving metadata for: ' + building)

    this.duraark.getPhysicalAsset(uri);
  })
});
