import Ember from 'ember';
import ENV from '../config/environment';

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

function _post(url, data) {
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

export
default Ember.Route.extend({

    model: function(params) {
        return _get(apiConfig.host + '/semanticenrichmentstages/' + params.id);
        // return this.store.find('semanticenrichmentstage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        var url = apiConfig.host + '/semanticenrichmentstages/' + model.id,
            store = this.store;

        controller.set('isStarting', true);

        _get(url).then(function(stage) {
            var stage = Ember.Object.create(stage);
            controller.set("stage", stage);

            controller.set('isStarting', false);

            // var sessionId = stage.get('session');

            // store.find('session', sessionId).then(function(session) {
            //     session.get("filestage").then(function(filestage) {
            //         filestage.get("files").then(function(files) {
            //             controller.set('files', []);
            //             controller.set('files', files);
            //         });
            //     });
            // });
        });
    },

    actions: {
        save: function() {
            var stage = this.get('controller.stage')
;            var sessionId = stage.session;
            // var data = stage.getProperties('availableItems', 'selectedItems', 'session');

            var url = apiConfig.host + '/semanticenrichmentstages/' + sessionId;

            var data = {
                name: 'semanticenrichment',
                availableItems: stage.availableItems,
                selectedItems: stage.selectedItems,
                session: sessionId
            };

            // NOTE: the data is sent like in the line below to not have jQuery convert the data to form encoding.
            // See http://stackoverflow.com/questions/13956462/jquery-post-sends-form-data-and-not-json for more
            // information.
            _post(url, {json: JSON.stringify(data)}).then(function(record) {
                var stage = this.get('controller.stage');
                var session = this.get('controller.stage.session');
                this.transitionTo('preingest.show', session);
            }.bind(this));
        },

        selectItem: function(item) {
            var items = this.get('controller.stage.selectedItems');
            items.pushObject(item);
        },

        deselectItem: function(item) {
            var items = this.get('controller.stage.selectedItems');
            items.removeObject(item);
        }
    }
});