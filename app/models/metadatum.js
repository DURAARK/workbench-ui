import DS from 'ember-data';

export
default DS.Model.extend({
    schema: DS.attr('string'),
    model: DS.attr(),

    file: DS.belongsTo('file'),

    modelArray: function() {
        var prop3,
            propertyArray = [];

        prop3 = this.get('model');

        if (prop3) {
            for (var key in prop3) {
                if (prop3.hasOwnProperty(key) && key !== "toString") {
                    propertyArray.push({
                        key: key,
                        value: prop3[key]
                    });
                }
            }

            return propertyArray;
        } else {
            return [];
        }
    }.property('model')
});