import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'metadata'
    }),
    metadata: DS.hasMany('metadatum', {
        async: true
    }, {
        defaultValue: []
    }),
    session: DS.belongsTo('session', {
        async: true
    }),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
});