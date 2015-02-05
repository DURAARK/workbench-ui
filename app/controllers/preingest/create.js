import Ember from 'ember';

export
default Ember.Controller.extend({
    actions: {
        createSession: function() {
            var name = this.get('name'),
                creator = this.get('creator'),
                description = this.get('description');

            // console.log('Name: ' + name);
            // console.log('Creator: ' + creator);
            // console.log('Description: ' + description);

            // TODO: check input and give visual feedback!
            if (!name.trim() || !creator.trim()) {
                return;
            }

            var session = this.store.createRecord('session', {
                name: name,
                creator: creator,
                created: new Date(),
                status: 'new'
            });

            var workflowIds = [],
                startIdx = this.store.all('workflow').get('length');

            for (var idx = 0; idx < this.get('workflows').length; idx++) {
                var workflow = this.get('workflows')[idx];

                var workflow = this.store.createRecord('workflow', workflow);
                session.get('workflows').addObject(workflow);
            };

            // TODO: save to microservice-sessions!
            // session.save();

            this.transitionToRoute('preingest.show', session);
        }
    },

    workflows: [{
        name: 'Files',
        component: 'workflow-overview-files',
        status: 'new',
        customData: [],
    }, {
        name: 'Metadata',
        component: 'workflow-overview-metadata',
        status: 'new',
        customData: {}
    }, {
        name: 'Semantic Enrichment',
        component: 'workflow-overview-semanticenrichment',
        status: 'new',
        customData: {}
    }, {
        name: 'Geometric Enrichment',
        component: 'workflow-overview-geometricenrichment',
        status: 'new',
        customData: {}
    }, {
        name: 'SIP Generation',
        component: 'workflow-overview-sipgenerator',
        status: 'new',
        customData: {}
    }]
});