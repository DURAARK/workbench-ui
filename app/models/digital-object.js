import DS from 'ember-data';

export
default DS.Model.extend({
	schema: DS.attr('string'),
	file: DS.attr('string'), //FIXXME: replace with DURAARK's file model!
	// file: DS.belongsTo('file', {
	// 	async: true
	// }),

	instance: DS.attr()
});