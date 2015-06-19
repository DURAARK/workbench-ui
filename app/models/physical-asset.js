import DS from 'ember-data';

export
default DS.Model.extend({
	descMD: DS.attr(),
	// digitalObjects: DS.hasMany('digital-object'), // FIXXME: implement!
	digitalObjects: DS.attr(),

	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date')
});