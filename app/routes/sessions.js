import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return {
			sessions: [{
				id: 0,
				name: 'Review',
				author: 'Martin Hecher',
				files: [{
					path: '/storage/test.ifc',
					directory: false,
					size: 2048,
					mtime: new Date(),
					atime: new Date(),
					ctime: new Date()
				}, {
					path: '/storage/test.e57',
					directory: false,
					size: 20048,
					mtime: new Date(),
					atime: new Date(),
					ctime: new Date()
				}]
			}, {
				id: 1,
				name: 'Demo Session',
				author: 'Martin Hecher',
				files: [{
					path: '/storage/test.ifc',
					directory: false,
					size: 2048,
					mtime: new Date(),
					atime: new Date(),
					ctime: new Date()
				}, {
					path: '/storage/test.e57',
					directory: false,
					size: 20048,
					mtime: new Date(),
					atime: new Date(),
					ctime: new Date()
				}]
			}]
		}
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.set('sessions', model.sessions);
	}
});