import DS from 'ember-data';

export default DS.Model.extend({
	path: DS.attr('string'),
	ifcReconstruction: DS.attr(),
	hiddenFeatures: DS.attr()
});