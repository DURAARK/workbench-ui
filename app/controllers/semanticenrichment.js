import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export
default Ember.Controller.extend({
    ifcFiles: [],
    uniqueAvailableItems: [],
    locationPivots: ['IFCPOSTALADDRESS', 'IFCADDRESSLOCALITY', 'IFCPOSTALCOUNTRY'],
    selectedPivot: 'IFCADDRESSLOCALITY',

    actions: {
        getSemanticEnrichments: function(ifcFile) {
            var store = this.store,
                controller = this,
                stage = this.get('stage'),
                sessionId = stage.session,
                path = ifcFile.raw.get('path'),
                locationPivot = this.get('selectedPivot');

            console.log('Searching enrichments based on : ' + path);
            console.log('     location pivot: ' + locationPivot);

            // FIXXME: check if those two are still necessary and remove if not!
            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            controller.set('shownFile', ifcFile);
            controller.set('isUpdatingEnrichments', true);

            var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
            semanticEnrichmentAPI.getMetadataFor({
                path: path,
                session: parseInt(sessionId),
                locationProperty: locationPivot
            }).then(function(data) {
                controller.set('stage.availableItems', data.availableItems);
                controller.set('isUpdatingEnrichments', false);
            });
        }
    },

    onAvailableItemsChanged: function() {
        debugger;
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