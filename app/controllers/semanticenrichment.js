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

    actions: {
        selectSeedTemplate: function(seedTemplate) {
            console.log('selected: ' + seedTemplate.label);
        },

        getSemanticEnrichments: function() {
            var store = this.store,
                controller = this,
                stage = this.get('stage'),
                sessionId = stage.session,
                locationPivot = this.get('selectedPivot');

            // FIXXME: check if those two are still necessary and remove if not!
            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            // controller.set('shownFile', ifcFile);
            controller.set('isUpdatingEnrichments', true);

            var focusedCrawler = new FocusedCrawlerAPI();
            focusedCrawler.getTriples({
                seeds: ['http://dbpedia.org/resource/Wennigsen', 'http://dbpedia.org/ontology/largestCity'],
                depth: 1,
                user: sessionId
            }).then(function(data) {
                controller.set('hasError', false);
                controller.set('stage.availableItems', data.candidates);
                controller.set('isUpdatingEnrichments', false);
            }, function(data) {
                controller.set('isUpdatingEnrichments', false);
                controller.set('hasError', true);
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
            var uri = item.resourceUri;

            var resource = window.unescape(uri);
            var name = resource.split('/').pop();

            var result = uniqueItems.find(function(item, index, enumerable) {
                var resource0 = window.unescape(item.resourceUri);
                var name0 = resource0.split('/').pop();
                if (name0 === name) return true;
                return false;
            });

            if (!result) {
                uniqueItems.pushObject(item);
            } else {
                console.log('sckippasdf');
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