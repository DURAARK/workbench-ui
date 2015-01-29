import Ember from 'ember';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.Component.extend({
    actions: {
        showMetadata: function(fileinfo) {

            var filepath = fileinfo.get('path'),
                fileext = this._getFileExtension(filepath),
                api = null;

            console.log('filepath: ' + filepath);
            console.log('fileext: ' + fileext);

            if (fileext[0].toLowerCase() === 'ifc') {
                api = new IfcMetadataAPI();
            } else if (fileext[0].toLowerCase() === 'e57') {
                api = new E57MetadataAPI();
            }


            api.getMetadataFor(fileinfo.get('path')).then(function(data) {
                console.log('APP: data = ' + JSON.stringify(data, null, 4));
            });
        }
    },

    _getFileExtension: function(filepath) {
        return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
    }
});