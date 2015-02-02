import Ember from 'ember';

export
default Ember.Route.extend({
    model: function() {
        this.store.pushMany('workflow', [{
            id: 0,
            name: 'Files',
            component: 'workflow-overview-files',
            status: 'finished',
            customData: [{
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
            }],
        }, {
            id: 1,
            name: 'Metadata',
            component: 'workflow-overview-metadata',
            status: 'finished',
            customData: {
                ifcm: {
                    path: '/storage/test.ifc',
                    directory: false,
                    size: 2048,
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date()
                },
                e57m: {
                    path: '/storage/test.e57',
                    directory: false,
                    size: 20048,
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date()
                },
                buildm: {
                    path: '/storage/test.e57',
                    directory: false,
                    size: 20048,
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date()
                }
            },
        }, {
            id: 2,
            name: 'Semantic Enrichment',
            component: 'workflow-overview-semanticenrichment',
            status: 'finished',
            customData: {}
        }, {
            id: 3,
            name: 'Geometric Enrichment',
            component: 'workflow-overview-geometricenrichment',
            status: 'unfinished',
            customData: {}
        }]);

        this.store.pushMany('session', [{
            id: 0,
            name: 'Review',
            author: 'Martin Hecher',
            created: new Date(),
            status: 'finished',
            workflows: [0, 1, 2, 3]
        },{
            id: 1,
            name: 'Demosession',
            author: 'Martin Hecher',
            created: new Date(),
            status: 'inprocess',
            workflows: [0, 1, 2, 3]
        }]);

        return this.store.all('session');
    },

    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('sessions', model.get('content'));
    }
});