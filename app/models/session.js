import DS from 'ember-data';

var Session = DS.Model.extend({
    label: DS.attr('string'),
    // files: DS.hasMany('file', { async: true }),
    files: DS.attr(),
    // physicalAssets: DS.hasMany('physical-asset'),
    physicalAssets: DS.attr(),
    digitalObjects: DS.attr(),

    // physicalAssets: DS.hasMany('physical-assets'),
    // digitalObjects: DS.hasMany('digital-objects'),

    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});

export
default Session;
