import DS from 'ember-data';

export
default DS.Model.extend({
    label: DS.attr('string'),
    physicalAssets: DS.hasMany('physical-assets'),
    digitalObjects: DS.hasMany('digital-objects'),

    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
