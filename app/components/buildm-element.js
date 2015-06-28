import Ember from 'ember';

export default Ember.Component.extend({
  objectType: function() {
    var item = this.get('item');
    return item['@type'];
  }.property('item'),

  objectId: function() {
    var item = this.get('item');
    return item['@id'];
  }.property('item'),

  props: function() {
    var item = this.get('item'),
      myarray = [];

    _.forEach(item, function(value, key) {
      if (key !== '@id' && key !== '@type') {
        console.log('key: ' + key + ' | value: ' + value);

        var items = [];
        value.forEach(function(el) {
          if (el['@value'])
            items.push(el['@value'])
        });

        myarray.push({
          key: key,
          items: items
        });
      }
    });

    return myarray;
  }.property('item')
});
