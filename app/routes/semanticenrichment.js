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
        // this._super(controller, model);

        var url = apiConfig.host + '/semanticenrichmentstages/' + model.id,
            store = this.store;

        _get(url).then(function(stage) {
            var stage = Ember.Object.create(stage);
            controller.set("stage", stage);

            var sessionId = stage.get('session');
            
            store.find('session', sessionId).then(function(session) {
                session.get("filestage").then(function(filestage) {
                    filestage.get("files").then(function(files) {
                        controller.set('files', []);
                        controller.set('files', files);
                    });
                });
            });
        });
    },

    actions: {
        save: function() {
            var stage = this.get('controller.stage');
            var sessionId = stage.session;
            // var data = stage.getProperties('availableItems', 'selectedItems', 'session');

            var url = apiConfig.host + '/semanticenrichmentstages/' + sessionId;

            var available = [],
                selected = [];

            var availableItems = stage.availableItems,
                selectedItems = stage.selectedItems;

            for (var i = 0; i < availableItems.length; i++) {
                var item = availableItems[i];
                available.push(JSON.parse(JSON.stringify(item)))
            };

            for (var ii = 0; ii < selectedItems.length; ii++) {
                var item = selectedItems[ii];
                selected.push(JSON.parse(JSON.stringify(item)))
            };

            var data = {
                name: 'semanticenrichment',
                availableItems: available,
                selectedItems: selected,
                session: sessionId
            };

            _post(url, data).then(function(record) {
                var stage = this.get('controller.stage');
                var session = this.get('controller.stage.session');
                console.log('session: ' + session.id);
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