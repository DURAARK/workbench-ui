import Ember from 'ember';
import ENV from '../../config/environment';

var apiConfig = ENV.DURAARKAPI.sessions;

function _get(url) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        function handler(data, status, jqxhr) {
            if (jqxhr.status === 200) {
                resolve(data);
            } else {
                reject(new Error('[MetadataExtractionAPIMixin::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            }
        }

        var jqxhr = Ember.$.get(url, handler);

        jqxhr.fail(function() {
            reject(new Error('[MetadataExtractionAPIMixin::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
        });
    });
}

export
default Ember.Route.extend({
    model: function(params) {
        var session = this.store.find('session', params.id);
        debugger;
        return session;
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        this.send('highlightSession', model);

        controller.set('hasIfcFile', false);
        controller.set('hasE57File', false);

        model.get('geometricenrichmentstage').then(function(geostage) {
            console.log('geostage: ' + geostage);
            model.get('filestage').then(function(filestage) {
                filestage.get('files').then(function(filesArray) {
                    var files = filesArray.toArray();
                    // Check if an IFC file is present. If so, request the semantic enrichment stage:
                    for (var idx = 0; idx < files.length; idx++) {
                        var file = files[idx],
                            path = file.get('path'),
                            ext = _getFileExtension(path)[0];
                        if (ext === 'ifc') {
                            controller.set('hasIfcFile', true);

                            var sessionId = parseInt(model.get('id')),
                                url = apiConfig.host + '/semanticenrichmentstages/' + sessionId;

                            _get(url).then(function(stage) {
                                controller.set("semanticenrichmentstage", Ember.Object.create(stage));
                            });
                        } else if (ext === 'e57') {
                            controller.set('hasE57File', true);
                        }
                    }
                });
            });
        });
    }
});

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}