import DS from 'ember-data';

export
default DS.Model.extend({
	label: DS.attr('string'),
	path: DS.attr('string'),
	// physicalAssets: DS.belongsTo('physical-asset'), // FIXXME: implement!
	physicalAssets: DS.attr(),
	techMD: DS.attr(),
	descMD: DS.attr(),
	semMD: DS.attr(),
	// derivatives: DS.hasMany('derivative') // FIXXME: implement!
	derivatives: DS.attr(),

	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date')
});