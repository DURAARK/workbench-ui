import Ember from 'ember';

export default Ember.Component.extend({
	isBuildm: Ember.computed.equal('item.schema', 'buildm'),
	isIfcm: Ember.computed.equal('item.schema', 'ifcm'),
	isE57m: Ember.computed.equal('item.schema', 'e57m'),
});