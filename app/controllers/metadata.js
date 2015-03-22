import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';

function _getFileExtension(filepath) {
    return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export
default Ember.Controller.extend({
    actions: {
        selectItem: function(item) {
            var filename = item.get('file');
            var fileext = _getFileExtension(filename)[0];

            if (fileext === 'e57' && item.get('schema') === 'e57m') { // --> e57m
                this.transitionToRoute('metadata.e57m', item);
            }

            if (fileext === 'ifc' && item.get('schema') === 'ifcm') { // --> ifcm
                this.transitionToRoute('metadata.ifcm', item);
            }

            // FIXXME: refactor differentiation between digital-object and physical-asset!
            if (fileext === 'ifc' && item.get('schema') === 'buildm' && item.get('instance').hasOwnProperty('creator')) { // --> digitalObject
                this.transitionTo('metadata.digitalobject', item);
            }

            // FIXXME: refactor differentiation between digital-object and physical-asset!
            if (fileext === 'ifc' && item.get('schema') === 'buildm' && item.get('instance').hasOwnProperty('latitude')) { // --> physicalAsset
                this.transitionToRoute('metadata.physicalasset', item);
            }
        }
    }
});