import DS from 'ember-data';

export default DS.SailsRESTAdapter.extend({
	host: 'http://localhost:1337'
});

// export default DS.RESTAdapter.extend({
// 	host: 'http://localhost:1337'
// });