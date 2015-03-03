import Ember from 'ember';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.Component.extend({
    actions: {
        onClick: function(item) {
            this.sendAction('selectItem', item);
        }

    }
});