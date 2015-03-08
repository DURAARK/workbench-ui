import Ember from 'ember';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.ifcmetadata;
var host = apiConfig.host + ':' + apiConfig.port;

export
default Ember.Mixin.create({
    getMetadataFor: function(filepaths) {
        var data = {
                files: [filepaths]
            },
            url = host + this.get('extractEndpoint');

        return this._post(url, data).then(function(data) {
            return new Ember.RSVP.Promise(function(resolve) { //reject is handled inside this._get
                // The returned data does not necessarily contain the metadata already
                // (because the metadata is extracted from the given file, and the extraction
                // is asynchroneous and may need longer to complete). The 'status' field
                // contains 'pending', if the metadata is not yet ready. If ready, it contains
                // the code 'finished'. Therefore we check, if the field is stating 'finished',
                // otherwise we wait a few seconds and send repeated request to the API's job
                // interface until the data is available:

                // We requested a single file, therefore the response contains a single entry:
                var e57m = data[0];
                url = host + this.get('jobsEndpoint') + '/' + e57m.id;

                var checkFinished = function() {
                    this._get(url).then(function(record) {
                        if (record.status === 'finished') {
                            // We are good to go:
                            console.log('metadata: ' + JSON.stringify(record.metadata, null, 4));

                            resolve(record);
                        } else {
                            console.log('no metadata yet, checking again...');
                            setTimeout(checkFinished, 3000);
                        }
                    });
                }.bind(this);

                checkFinished();

            }.bind(this));
        }.bind(this));
    },

    _get: function(url) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            function handler(data, status, jqxhr) {
                if (jqxhr.status === 200) {
                    resolve(data);
                } else {
                    reject(new Error('[MetadataExtractionBase::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
                }
            }

            var jqxhr = Ember.$.get(url, handler);

            jqxhr.fail(function() {
                reject(new Error('[MetadataExtractionBase::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            });
        });
    },

    _post: function(url, data) {
        var that = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            function handler(data, status, jqxhr) {
                if (jqxhr.status === 201) {
                    resolve(data[that.get('responseKey')] || data); // FIXXME: do it one way or the other!
                } else {
                    reject(new Error('[MetadataExtractionBase::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
                }
            }

            Ember.$.post(url, data, handler);
        });
    }
});