import DS from 'ember-data';

export
default DS.Model.extend({
	label: DS.attr('string'),
	// physicalAssets: DS.hasMany('physical-asset', {
	// 	async: true
	// }),
	physicalAsset: DS.attr(),

	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date')
});