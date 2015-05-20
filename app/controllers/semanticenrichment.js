import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';
import FocusedCrawlerAPI from 'workbench-ui/bindings/api-focusedcrawler';

export
default Ember.Controller.extend({
    ifcFiles: [],
    uniqueAvailableItems: [],
    locationPivots: ['IFCPOSTALADDRESS', 'IFCBUILDING', 'IFCORGANIZATION'],
    selectedPivot: 'IFCPOSTALADDRESS',
    hasError: false,

    seedTemplates: [{
        label: 'Architectural Style',
        seeds: ['http://dbpedia.org/resource/Wennigsen', 'http://dbpedia.org/ontology/largestCity'],
        depth: 1
    }, {
        label: 'Material',
        seeds: ['http://dbpedia.org/resource/Wennigsen', 'http://dbpedia.org/ontology/largestCity'],
        depth: 1
    }, {
        label: 'Environment',
        seeds: ['http://dbpedia.org/resource/Wennigsen', 'http://dbpedia.org/ontology/largestCity'],
        depth: 1
    }, {
        label: 'Energy Consumption',
        seeds: ['http://dbpedia.org/resource/Wennigsen', 'http://dbpedia.org/ontology/largestCity'],
        depth: 1
    }],
    selectedTemplate: null,

    actions: {
        selectSeedTemplate: function(seedTemplate) {
            console.log('selected template: ' + seedTemplate.label);
            this.set('selectedTemplate', seedTemplate);
        },

        getSemanticEnrichments: function() {
            var store = this.store,
                controller = this,
                stage = this.get('stage'),
                sessionId = stage.session,
                locationPivot = this.get('selectedPivot');

            // Reset eventual error:
            controller.set('hasError', false);
            controller.set('errorText', '');

            // FIXXME: check if those two are still necessary and remove if not!
            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            // controller.set('shownFile', ifcFile);
            controller.set('isUpdatingEnrichments', true);

            var selectedTemplate = this.get('selectedTemplate');
            if (!selectedTemplate) {
                controller.set('hasError', true);
                controller.set('errorText', 'Select one of the templates above first!');

                return;
            }

            selectedTemplate.user = sessionId;

            var focusedCrawler = new FocusedCrawlerAPI();
            focusedCrawler.getTriples(selectedTemplate).then(function(data) {
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