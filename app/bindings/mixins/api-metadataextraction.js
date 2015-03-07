import Ember from 'ember';

export
default Ember.Mixin.create({
    getMetadataFor: function(filepaths) {
        var data = {
                files: [filepaths]
            },
            url = this.get('host') + this.get('extractEndpoint');

        return this._post(url, data).then(function(response) {
            return new Ember.RSVP.Promise(function(resolve) { //reject is handled inside this._get
                // The returned data does not necessarily contain the metadata already
                // (because the metadata is extracted from the given file, and the extraction
                // is asynchroneous and may need longer to complete). The 'status' field
                // contains 'pending', if the metadata is not yet ready. If ready, it contains
                // the code 'finished'. Therefore we check, if the field is stating 'finished',
                // otherwise we wait a few seconds and send repeated request to the API's job
                // interface until the data is available:

                // We requested a single file, therefore the response contains a single entry:
                var metadata = response[0];
                url = this.get('host') + this.get('jobsEndpoint') + '/' + metadata.id;

                var checkFinished = function(md) {
                    // NOTE: in some cases 'md' is undefined
                    if (md && md.status === 'finished') {
                        resolve(md);
                        return;
                    }

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

                checkFinished(metadata);

            }.bind(this));
        }.bind(this));
    },

    _get: function(url) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            function handler(data, status, jqxhr) {
                if (status === 'success') {
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
    },

    _post: function(url, data) {
        var that = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            function handler(data, status, jqxhr) {
                if (status === 'success') {
                    resolve(data);
                } else {
                    reject(new Error('[MetadataExtractionAPIMixin::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
                }
            }

            Ember.$.post(url, data, handler);
        });
    }
});