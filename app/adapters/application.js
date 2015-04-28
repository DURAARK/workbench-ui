import DS from 'ember-data';

export
// default DS.RESTAdapter.extend({});
default DS.SailsRESTAdapter.extend({
    host: function() {
        var host = this.get('apiConfig.host') + this.get('endpoint');
        console.log('Connecting "' + this.get('label') + '" ' + host);
        return host;
    }.property().volatile(),

    pathForType: function(type) {
        var camelized = Ember.String.camelize(type);
        return Ember.String.pluralize(camelized);
    }
});