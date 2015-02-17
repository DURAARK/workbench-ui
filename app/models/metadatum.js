import DS from 'ember-data';

export
default DS.Model.extend({
    schema: DS.attr('string'),
    model: DS.attr(),

    file: DS.belongsTo('file'),

    modelArray: function() {
        var model,
            propertyArray = [];

        model = this.get('model');

        if (model) {
            for (var key in model) {
                if (model.hasOwnProperty(key) && key !== "toString") {
                    propertyArray.push({
                        key: key,
                        value: model[key]
                    });
                }
            }

            return propertyArray;
        } else {
            return [];
        }
    }.property('model')
});