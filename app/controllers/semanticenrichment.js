import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';
import FocusedCrawlerAPI from 'workbench-ui/bindings/api-focusedcrawler';

export
default Ember.Controller.extend({
    ifcFiles: [],
    uniqueAvailableItems: [],

    seedTemplates: [Ember.Object.create({
            label: 'Architectural Style',
            seeds: ['http://dbpedia.org/resource/Wennigsen', ],
            depth: 1,
            selected: false
        }),
        Ember.Object.create({
            label: 'Material',
            seeds: ['http://dbpedia.org/resource/Graz'],
            depth: 1,
            selected: false
        }),
        Ember.Object.create({
            label: 'Environment',
            seeds: ['http://dbpedia.org/ontology/nobelLaureates', 'http://dbpedia.org/ontology/railwayPlatforms'],
            depth: 1,
            selected: false
        }),
        Ember.Object.create({
            label: 'Energy Consumption',
            seeds: ['http://dbpedia.org/ontology/railwayPlatforms'],
            depth: 1,
            selected: false
        })
    ],

    hasError: false,
    isLoading: false,

    actions: {
        toggleSeedSelection: function(seedTemplate) {
            if (seedTemplate.get('selected')) {
                seedTemplate.set('selected', false);
                console.log('deselected seed template: ' + seedTemplate.label);
            } else {
                seedTemplate.set('selected', true);
                console.log('selected seed template: ' + seedTemplate.label);
            }
        },

        getSemanticEnrichments: function() {
            var store = this.store,
                controller = this,
                stage = this.get('stage'),
                sessionId = stage.session;

            // Reset eventual error:
            controller.set('hasError', false);
            controller.set('errorText', '');

            // FIXXME: check if those two are still necessary and remove if not!
            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            // controller.set('shownFile', ifcFile);
            controller.set('isUpdatingEnrichments', true);

            var selectedTemplates = this.get('seedTemplates').filterBy('selected', true),
                seeds = [];

            if (!selectedTemplates.length) {
                controller.set('hasError', true);
                controller.set('errorText', 'Select one of the templates above first!');

                return;
            }

            selectedTemplates.forEach(function(template) {
                template.get('seeds').forEach(function(item) {
                    seeds.push(item);
                })
            });

            console.log('Seeds:\n\n' + JSON.stringify(seeds, null, 4));

            var focusedCrawler = new FocusedCrawlerAPI();
            focusedCrawler.getTriples({
                seeds: seeds,
                depth: 1,
                user: sessionId
            }).then(function(data) {
                controller.set('isUpdatingEnrichments', false);
                controller.set('stage.availableItems', data.candidates);
            }, function(data) {
                controller.set('hasError', true);
                controller.set('errorText', 'Something went wrong. Try again! If the error is permanent contact your system administrator.');

                controller.set('isUpdatingEnrichments', false);
            });
        }
    },

    // FIXXME: this function creates a unique array based on the 'resourceUri' of the availableItems.
    // As a bad sideeffect it discards enrichment triples, cause the resourceUri cn be the same for 
    // different triples. So, at the moment this is fine for demonstration purposes, for production use
    // this is a BUG!
    onAvailableItemsChanged: function() {
        var items = this.get('stage.availableItems'),
            uniqueItems = [];

        items.filter(function(item, index, enumerable) {
            var uri = item.entity;

            var resource = window.unescape(uri);
            var name = resource.split('/').pop();

            var result = uniqueItems.find(function(item, index, enumerable) {
                var resource0 = window.unescape(item.entity);
                var name0 = resource0.split('/').pop();
                if (name0 === name) return true;
                return false;
            });

            if (!result) {
                uniqueItems.pushObject(item);
            } else {
                console.log('Should not happen, investigate!');
            }
        });

        this.set('uniqueAvailableItems', uniqueItems);

    }.observes('stage.availableItems'),

    onFilesChanged: function() {
        var files = this.get('files');

        // reset current files:
        this.set('ifcFiles', []);
        var ifcFiles = this.get('ifcFiles');

        files.forEach(function(file) {
            var ext = _getFileExtension(file.get('path'))[0];
            if (ext.toLowerCase() === 'ifc') {
                ifcFiles.pushObject({
                    filename: file.get('path').split('/').pop(),
                    raw: file
                });
            }
        })
    }.observes('files')
});

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}