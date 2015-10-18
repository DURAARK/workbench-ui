import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.findAll('session');
      // return [{
      //   state: 'wip',
      //   label: 'Haus 30',
      //   address: 'Haus30er Strasse, Berlin',
      //   description: 'Session documenting the renovation of the Haus30 in Berlin.',
      //
      //   physicalAssets: [],
      //   digitalObjects: [],
      //
      //   config: {
      //     sda: {
      //       topics: ["Haus 30 (general context)", "Haus 30 (political context)"]
      //     },
      //     geometricenrichment: {
      //       tools: ["IFC Reconstruction"]
      //     }
      //   },
      //
      //   files: [{
      //     path: "/duraark-storage/sessions/haus30-fixed/master/Plan3D_Haus30_PREVIEW.ifc",
      //     type: "ifc-spf",
      //     size: 21656908,
      //     directory: false,
      //     atime: "2015-07-30T16:16:10.000Z",
      //     mtime: "2015-07-30T16:16:15.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.384Z",
      //     updatedAt: "2015-08-02T09:00:41.042Z",
      //     id: 1
      //   }, {
      //     path: "/duraark-storage/sessions/haus30-fixed/master/Plan3D_OG_subsampled.e57",
      //     type: "e57",
      //     size: 258907136,
      //     directory: false,
      //     atime: "2015-07-30T16:16:15.000Z",
      //     mtime: "2015-07-30T16:16:19.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.415Z",
      //     updatedAt: "2015-07-31T14:20:40.432Z",
      //     id: 2
      //   }]
      // }, {
      //   state: 'archived',
      //   label: 'Nygade',
      //   address: 'Nygade Straat, Kopenhagen',
      //   description: 'Session documenting the renovation of the Nygade building.',
      //
      //   physicalAssets: [],
      //   digitalObjects: [],
      //
      //   config: {
      //     sda: {
      //       topics: ["Nygade (general context)"]
      //     },
      //     geometricenrichment: {
      //       tools: ["IFC Reconstruction", "Electrical Appliance Detection"]
      //     }
      //   },
      //
      //   files: [{
      //     path: "/duraark-storage/sessions/nygade1005-1006-fixed/master/Nygade_Scan1005-1006.e57",
      //     type: "e57",
      //     size: 538401792,
      //     directory: false,
      //     atime: "2015-07-30T16:16:04.000Z",
      //     mtime: "2015-07-30T16:16:08.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.373Z",
      //     updatedAt: "2015-07-31T14:20:40.402Z",
      //     id: 1
      //   }, {
      //     path: "/duraark-storage/sessions/nygade1005-1006-fixed/master/Nygade_Scan1005-1006.ifc",
      //     type: "ifc-spf",
      //     size: 54495,
      //     directory: false,
      //     atime: "2015-07-30T16:16:08.000Z",
      //     mtime: "2015-07-30T16:16:10.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.378Z",
      //     updatedAt: "2015-08-02T09:00:34.781Z",
      //     id: 2
      //   }]
      // }];
    },

    setupController(controller, model) {
      this._super(controller, model);

      this.send('setTitle', 'Archive Buildings - Sessions');
      this.send('showWorkflowSteps', false);

      var appState = this.modelFor('application');
      controller.set('preingestState', appState.get('preingest'));
    }
});
