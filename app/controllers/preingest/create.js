import Ember from 'ember';
import ENV from '../../config/environment';

var apiConfig = ENV.DURAARKAPI.sessions;

function _post(url, data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        function handler(data, status, jqxhr) {
            if (jqxhr.statusText === 'OK') {
                resolve(data);
            } else {
                reject(new Error('[MetadataExtractionBase::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            }
        }

        Ember.$.post(url, data, handler);
    });
}

function _put(url, data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        function handler(data, status, jqxhr) {
            if (jqxhr.statusText === 'OK') {
                resolve(data);
            } else {
                reject(new Error('[MetadataExtractionBase::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            }
        }

        Ember.$.ajax({
            type: "PUT",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data)
        }).then(function(data, status, jqxhr) {
            handler(data, status, jqxhr);
        });
    });
}

export
default Ember.Controller.extend({
    actions: {
        createSession: function() {
            var name = this.get('name'),
                store = this.store,
                creator = this.get('creator'),
                description = this.get('description'),
                that = this;

            // TODO: check input and give visual feedback!
            if (!name.trim() || !creator.trim()) {
                return;
            }

            // TODO: Is there a more straightforward way of creating records
            // that are referencing each other?

            var filestage = this.store.createRecord('filestage'),
                geometricenrichmentstage = this.store.createRecord('geometricenrichmentstage'),
                metadatastage = this.store.createRecord('metadatastage'),
                semanticenrichmentstage = this.store.createRecord('semanticenrichmentstage'),
                physicalAsset = this.store.createRecord('physical-asset');

            physicalAsset.set('file', 'dummy.ifc');
            physicalAsset.set('schema', 'buildm');

            // Create empty instance:
            var physicalAssetInstanceTemplate = {
                identifier: '',
                latitude: '',
                longitude: '',
                owner: '',
                buildingArea: -1,
                floorCount: -1,
                numberOfRooms: -1,
                'function': '',
                architecturalStyle: '',
                description: '',
                location: '',
                streetAddress: '',
                postalCodeStart: '',
                postalCodeEnd: '',
                postOfficeBoxNumber: '',
                addressRegion: '',
                postalLocality: '',
                architect: '',
                contributor: '',
                startDate: -1,
                completionDate: -1,
                constructionTime: -1,
                rebuildingDate: -1,
                modificationDetails: '',
                cost: -1,
                rightsDetails: ''
            };
            physicalAsset.set('instance', physicalAssetInstanceTemplate);

            physicalAsset.save().then(function(pa) {
                metadatastage.get('physicalAssets').pushObject(pa);
                var semstage = {
                    name: 'semanticenrichment',
                    availableItems: [],
                    selectedItems: [],
                    session: store.all('session').get('length') + 1
                };

                console.log('sessoin: ' + semstage.session);
                var url = apiConfig.host + '/semanticenrichmentstages';
                console.log('url: ' + url);

                _post(url, semstage).then(function(sesRecord) {
                    metadatastage.save().then(function(mdsRecord) {
                        geometricenrichmentstage.save().then(function(gesRecord) {
                            filestage.save().then(function(fsRecord) {
                                // semanticenrichmentstage.save().then(function(sesRecord) {

                                var session = that.store.createRecord('session', {
                                    name: name,
                                    creator: creator,
                                    description: description,
                                    filestage: fsRecord,
                                    metadatastage: mdsRecord,
                                    geometricenrichmentstage: gesRecord,
                                    semanticenrichmentstage: sesRecord
                                });

                                session.save().then(function(sessionRecord) {
                                    fsRecord.set('session', sessionRecord);
                                    mdsRecord.set('session', sessionRecord);
                                    gesRecord.set('session', sessionRecord);
                                    sesRecord.session = parseInt(sessionRecord.get('id'));
                                    sesRecord.name = 'semanticenrichment';

                                    fsRecord.save().then(function() {
                                        mdsRecord.save().then(function() {
                                            gesRecord.save().then(function() {
                                                _put(url + '/' + sesRecord.id, sesRecord).then(function(rec) {
                                                    that.transitionToRoute('preingest.show', sessionRecord);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }
});