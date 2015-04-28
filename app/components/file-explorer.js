import Ember from 'ember';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.Component.extend({
    showOnlySelected: false,

    // selectedItems: Em.computed.filterBy('items', 'isSelected', true),
    // deselectedItems: Em.computed.filterBy('items', 'isSelected', false),

    actions: {
        showMetadata: function(fileinfo) {
            var filepath = fileinfo.get('path'),
                fileext = this._getFileExtension(filepath),
                api = null;

            // console.log('filepath: ' + filepath);
            // console.log('fileext: ' + fileext);

            if (fileext[0].toLowerCase() === 'ifc') {
                api = E57MetadataAPI.create({
                    host: this.get('apiConfig.host') + ENV.DURAARKAPI.ifcmetadata.endpoint
                });
            } else if (fileext[0].toLowerCase() === 'e57') {
                api = E57MetadataAPI.create({
                    host: this.get('apiConfig.host') + ENV.DURAARKAPI.e57metadata.endpoint
                });
            }

            api.getMetadataFor(fileinfo.get('path')).then(function(data) {
                console.log('APP: data = ' + JSON.stringify(data, null, 4));
            });
        },

        onClick: function(item) {
            this.sendAction('selectFile', item);
        }

    },

    // // Create the items' 'isSelected' property on initialization:
    // onItemsChanged: function() {
    //     var items = this.get('items');

    //     if (items) {
    //         items.forEach(function(item) {
    //             item.set('isSelected', false);
    //         });
    //     }
    // }.observes('items').on('init'),

    _getFileExtension: function(filepath) {
        return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
    }
});