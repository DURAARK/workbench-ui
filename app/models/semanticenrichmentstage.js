import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'semenrichment'
    }),

    availableItems: DS.hasMany('enrichment-item', {
        async: true
    }),

    selectedItems: DS.hasMany('enrichment-item', {
        async: true
    }),

    session: DS.belongsTo('session', {
        async: true
    }),

    createdAt: DS.attr('date'),

    updatedAt: DS.attr('date'),

    isLoading: DS.attr('boolean', {
        defaultValue: false
    })
});