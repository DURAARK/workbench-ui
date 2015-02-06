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
        }, {
            id: 4,
            name: 'SIP Generation',
            component: 'workflow-overview-sipgenerator',
            status: 'unfinished',
            customData: {}
        }]);

        // FIXXME: hackish way to add a fresh session:
        this.store.pushMany('workflow', this.get('workflows'));

        this.store.pushMany('session', [{
            id: 0,
            name: 'Review',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'finished',
            workflows: [0, 1, 2, 3, 4]
        }, {
            id: 1,
            name: 'Demosession',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'inprocess',
            workflows: [0, 1, 2, 3, 4]
        }, {
            id: 2,
            name: 'New Session',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'new',
            workflows: [5, 6, 7, 8, 9]
        }]);

        return this.store.all('session');
    },

    setupController: function(controller, model) {
        var sessions = model.get('content');

        // Add the 'view model' properties to the sessions:
        sessions.forEach(function(session) {
            session.set('isSelected', false);
        });

        controller.set('model', model);
        controller.set('sessions', sessions);
    },

    workflows: [{
        id: 5,
        name: 'Files',
        component: 'workflow-overview-files',
        status: 'new',
        customData: [],
    }, {
        id: 6,
        name: 'Metadata',
        component: 'workflow-overview-metadata',
        status: 'new',
        customData: {}
    }, {
        id: 7,
        name: 'Semantic Enrichment',
        component: 'workflow-overview-semanticenrichment',
        status: 'new',
        customData: {}
    }, {
        id: 8,
        name: 'Geometric Enrichment',
        component: 'workflow-overview-geometricenrichment',
        status: 'new',
        customData: {}
    }, {
        id: 9,
        name: 'SIP Generation',
        component: 'workflow-overview-sipgenerator',
        status: 'new',
        customData: {}
    }]
});