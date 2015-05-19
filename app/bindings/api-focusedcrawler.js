import Ember from 'ember';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.focusedcrawler;

export
default Ember.Object.extend({
    getTriples: function(config) {
        var url = apiConfig.host + apiConfig.extractEndpoint;

        console.log('URL: ' + url);

        return this._get(url, config).then(function(response) {
            return new Ember.RSVP.Promise(function(resolve, reject) { //reject is handled inside this._get
                // The returned data does not necessarily contain the metadata already
                // (because the metadata is extracted from the given file, and the extraction
                // is asynchroneous and may need longer to complete). The 'status' field
                // contains 'pending', if the metadata is not yet ready. If ready, it contains
                // the code 'finished'. Therefore we check, if the field is stating 'finished',
                // otherwise we wait a few seconds and send repeated request to the API's job
                // interface until the data is available:

                // We requested a single file, therefore the response contains a single entry:
                url = apiConfig.host + apiConfig.jobsEndpoint + '/' + response.id;
                // url = 'http://localhost:5006/crawl/' + response.id;

                var checkFinished = function(res) {
                    // NOTE: in some cases 'md' is undefined
                    if (res && res.status === 'finished') {
                        return resolve(res);
                    } else if (res && res.status === 'error') {
                        return reject(res);
                    }

                    this._get(url).then(function(record) {
                        if (record.status === 'finished') {
                            // We are good to go:
                            console.log('candidates: ' + JSON.stringify(record.candidates, null, 4));

                            resolve(record);
                        } else if (record.status === 'error') {
                            console.log('error returned');
                            return reject(res);
                        } else {
                            console.log('no metadata yet, checking again...');
                            setTimeout(checkFinished, 3000);
                        }
                    });
                }.bind(this);

                checkFinished(response);

            }.bind(this));
        }.bind(this));
    },

    _get: function(url, params) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            function handler(data, status, jqxhr) {
                if (status === 'success') {
                    resolve(data);
                } else {
                    reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
                }
            }

            var jqxhr = Ember.$.get(url, params, handler);

            jqxhr.fail(function() {
                reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
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
                    reject(new Error('[FocusedCrawlerAPI::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
                }
            }

            Ember.$.post(url, data, handler);
        });
    }
});