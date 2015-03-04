import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'semanticenrichment'
    }),

    availableItems: DS.hasMany('enrichment-item'),

    selectedItems: DS.hasMany('enrichment-item'),

    session: DS.belongsTo('session', {
        async: true
    }),

    createdAt: DS.attr('date'),

    updatedAt: DS.attr('date'),

    isLoading: DS.attr('boolean', {
        defaultValue: false
    })
});