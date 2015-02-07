import Ember from 'ember';

export
default Ember.Route.extend({
    model: function() {
        // this.store.pushMany('workflow', [{
        //     id: 0,
        //     name: 'Files',
        //     component: 'workflow-overview-files',
        //     status: 'finished',
        //     customData: [{
        //         path: '/storage/test.ifc',
        //         directory: false,
        //         size: 2048,
        //         mtime: new Date(),
        //         atime: new Date(),
        //         ctime: new Date()
        //     }, {
        //         path: '/storage/test.e57',
        //         directory: false,
        //         size: 20048,
        //         mtime: new Date(),
        //         atime: new Date(),
        //         ctime: new Date()
        //     }],
        // }, {
        //     id: 1,
        //     name: 'Metadata',
        //     component: 'workflow-overview-metadata',
        //     status: 'finished',
        //     customData: {
        //         ifcm: {
        //             path: '/storage/test.ifc',
        //             directory: false,
        //             size: 2048,
        //             mtime: new Date(),
        //             atime: new Date(),
        //             ctime: new Date()
        //         },
        //         e57m: {
        //             path: '/storage/test.e57',
        //             directory: false,
        //             size: 20048,
        //             mtime: new Date(),
        //             atime: new Date(),
        //             ctime: new Date()
        //         },
        //         buildm: {
        //             path: '/storage/test.e57',
        //             directory: false,
        //             size: 20048,
        //             mtime: new Date(),
        //             atime: new Date(),
        //             ctime: new Date()
        //         }
        //     },
        // }, {
        //     id: 2,
        //     name: 'Semantic Enrichment',
        //     component: 'workflow-overview-semanticenrichment',
        //     status: 'finished',
        //     customData: {}
        // }, {
        //     id: 3,
        //     name: 'Geometric Enrichment',
        //     component: 'workflow-overview-geometricenrichment',
        //     status: 'unfinished',
        //     customData: {}
        // }, {
        //     id: 4,
        //     name: 'SIP Generation',
        //     component: 'workflow-overview-sipgenerator',
        //     status: 'unfinished',
        //     customData: {}
        // }]);

        this.store.pushMany('file', [{
            id: 0,
            path: '/storage/test.ifc',
            directory: false,
            size: 2048,
            mtime: new Date(),
            atime: new Date(),
            ctime: new Date()
        }, {
            id: 1,
            path: '/storage/test.e57',
            directory: false,
            size: 20048,
            mtime: new Date(),
            atime: new Date(),
            ctime: new Date()
        }]);

        this.store.push('wf-files', {
            id: 0,
            status: 'created',
            files: [0, 1]
        });

        this.store.push('metadata-info', {
            id: 0,
            type: 'ifcm',
            available: false,
            metadata: {}
        });

        this.store.push('metadata-info', {
            id: 1,
            type: 'e57m',
            available: true,
            metadata: {}
        });

        this.store.push('wf-metadata', {
            id: 0,
            status: 'pending',
            files: [0, 1]
        });

        this.store.push('sem-enrichment', {
            id: 0,
            concept: 'info:lc/authorities/sh85006792',
            value: 'Gothic building'
        });

        this.store.push('sem-enrichment', {
            id: 1,
            concept: 'info:lc/authorities/sh85006792',
            value: 'Gothic building'
        });

        this.store.push('wf-sem-enrichment', {
            id: 0,
            enrichments: [0, 1]
        });

        this.store.push('geo-enrichment', {
            id: 0,
            application: 'IFC Reconstruction',
            enrichments: 'available'
        });

        this.store.push('geo-enrichment', {
            id: 1,
            application: 'IFC DifferenceDetection',
            enrichments: 'available'
        });

        this.store.push('geo-enrichment', {
            id: 2,
            application: 'RISE',
            enrichments: 'available'
        });

        this.store.push('wf-geo-enrichment', {
            id: 0,
            status: 'pending',
            enrichments: [0, 1, 2]
        });

        this.store.push('wf-sip-generator', {
            id: 0,
            status: 'finished',
            files: [0, 1],
            archive: 'http://juliet.cgv.tugraz.at/archive/mySIP.zip'
        });

        this.store.pushMany('session', [{
            id: 0,
            name: 'Review',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'finished',
            wfFiles: 0,
            wfMetadata: 0,
            wfSemEnrichment: 0,
            wfGeoEnrichment: 0,
            wfSipGenerator: 0
        }, {
            id: 1,
            name: 'Demosession',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'inprocess',
            wfFiles: 0,
            wfMetadata: 0,
            wfSemEnrichment: 0,
            wfGeoEnrichment: 0,
            wfSipGenerator: 0
        }, {
            id: 2,
            name: 'New Session',
            creator: 'Martin Hecher',
            created: new Date(),
            status: 'new',
            wfFiles: 0,
            wfMetadata: 0,
            wfSemEnrichment: 0,
            wfGeoEnrichment: 0,
            wfSipGenerator: 0
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