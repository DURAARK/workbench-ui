import DS from 'ember-data';

export default DS.Model.extend({
	path: DS.attr('string'),
	schema: DS.attr('string'),
	content: DS.attr()
});