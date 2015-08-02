import DS from 'ember-data';

var Session = DS.Model.extend({
    label: DS.attr('string'),
    files: DS.attr(),
    physicalAssets: DS.attr(),
    digitalObjects: DS.attr(),
    config: DS.attr(),

    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});

export
default Session;
