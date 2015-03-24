import Ember from 'ember';

function _getFileExtension(filepath) {
    return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export
default Ember.Route.extend({
    selectedFiles: [],
    availableFiles: [],

    model: function(params) {
        return this.store.find('filestage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('selectedFiles', model.get('files'));

        this.store.find('file').then(function(records) {
            controller.set('availableFiles', records);
        });
    },

    actions: {
        save: function() {
            // FIXXME: update metadatastage here!
            var session = this.get('controller.model.session'),
                controller = this.get('controller'),
                store = this.store;

            session.get('metadatastage').then(function(mdStage) {
                mdStage.get('physicalAssets').then(function(pas) {
                    mdStage.get('digitalObjects').then(function(dos) {

                        dos.forEach(function(obj) {
                            debugger;
                            obj.deleteRecord();
                            obj.save();
                        });
                        var setPhysicalAsset = false;

                        controller.get('files').forEach(function(file) {
                            var ext = _getFileExtension(file.get('path'))[0];

                            if (ext.toLowerCase() === 'ifc') {
                                if (!setPhysicalAsset) {
                                    var asset = pas.toArray()[0];
                                    asset.set('file', file.get('path'));
                                    setPhysicalAsset = true;

                                    asset.save();
                                }
                            }

                            // var dobject = store.createRecord('digital-object');
                            // dobject.set('schema', 'buildm');
                            // dobject.set('file', file.get('path'));
                            // dobject.set('instance', {});
                            // dos.pushObject(dobject);

                            // dobject.save();
                        });

                        pas.save();
                        dos.save();

                        mdStage.save().then(function() {
                            controller.get('model').save().then(function() {
                                var session = controller.get('model.session');
                                controller.transitionTo('preingest.show', session);
                            }.bind(this));
                        });
                    });
                });
            });
        },

        selectFile: function(file) {
            // console.log('selected: ' + file.get('path'));

            var model = this.get('controller.model');
            model.get('files').pushObject(file);
        },

        deselectFile: function(file) {
            // console.log('deselected: ' + file.get('path'));

            var model = this.get('controller.model');
            model.get('files').removeObject(file);
        }
    }
});