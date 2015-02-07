import DS from 'ember-data';

export default DS.Model.extend({
	status: DS.attr('string'),
	enrichments: DS.hasMany('sem-enrichment')
});