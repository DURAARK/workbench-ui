import DS from 'ember-data';

export default DS.Model.extend({
	schema: DS.attr('string'),
	model: DS.attr(),

	file: DS.belongsTo('file')
});