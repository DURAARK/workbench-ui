import Ember from 'ember';
// import _ from 'underscore';

export default Ember.Route.extend({
  model() {
      // return this.duraark.getAllPhysicalAssets();
      return {};
    },

    setupController(controller, model) {
      this._super(controller, model);

      // let places = [];
      //
      // _.each(model, function(building) {
      //   places.push({
      //     name: building['http://data.duraark.eu/vocab/buildm/name'][0]['value'],
      //     latitude: building['http://data.duraark.eu/vocab/buildm/latitude'][0]['value'],
      //     longitude: building['http://data.duraark.eu/vocab/buildm/longitude'][0]['value'],
      //   });
      // });

      // controller.set('buildings', model);
      // controller.set('places', places);

      this.send('setTitle', 'Search Buildings');

      var appState = this.modelFor('application');
      controller.set('retrieveState', appState.get('retrieve'));
    }
});
