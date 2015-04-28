import Ember from 'ember';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.Controller.extend({
    name: "ifc",

    // TODO: functions have to be exported in listing them in the 'commands' hash:
    commands: [
        'showMetadata',
        'showObject'
    ],

    showMetadata: function(fileRecord) {
        this.transitionToRoute('index');

        var filepath = fileRecord.get('path');
        // FIXXME: replace with this._getFileExtension()
        // var fileext = (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
        var fileext = this._getFileExtension(filepath);
        var api = null;

        console.log('filepath: ' + filepath);
        console.log('fileext: ' + fileext);

        if (fileext[0].toLowerCase() === 'ifc') {
            api = IfcMetadataAPI.create({
                host: this.get('apiConfig.host') + ENV.DURAARKAPI.ifcmetadata.endpoint
            });
        } else if (fileext[0].toLowerCase() === 'e57') {
            api = E57MetadataAPI.create({
                host: this.get('apiConfig.host') + ENV.DURAARKAPI.e57metadata.endpoint
            });
        }

        api.getMetadataFor(filepath).then(function(data) {
            console.log('APP: data = ' + JSON.stringify(data, null, 4));
            this.set('metadataRaw', data.metadata);
        }.bind(this));
    },

    showObject: function( /*fileRecord*/ ) {
        console.log('Dummy IFC viewer');
    },

    _getFileExtension: function(filepath) {
        return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
    }
});