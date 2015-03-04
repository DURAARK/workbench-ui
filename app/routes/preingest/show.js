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
        return this.store.find('session', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        this.send('highlightSession', model);

        var sessionId = parseInt(model.get('id')),
            url = apiConfig.host + '/semanticenrichmentstages/' + sessionId;

        _get(url).then(function(stage) {
            controller.set("semanticenrichmentstage", Ember.Object.create(stage));
        }.bind(this));
    }
});