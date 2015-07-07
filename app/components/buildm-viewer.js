import Ember from 'ember';

export default Ember.Component.extend({
  physicalAsset: function() {
    var pa = this.get('file.metadata.physicalAsset'),
      result = [],
      controller = this;

    _.each(pa, function(value, key) {
      var entry = controller.extractFromJSONLD(value, key);
      if (entry) {
        result.push(entry);
      }
    });

    return result;
  }.property('file'),

  digitalObject: function() {
    var da = this.get('file.metadata.digitalObject'),
      result = [],
      controller = this;

    _.each(da, function(value, key) {
      var entry = controller.extractFromJSONLD(value, key);
      if (entry) {
        result.push(entry);
      }
    });

    return result;
  }.property('file'),

  didInsertElement: function() {
    var controller = this;
    var dropdown = document.querySelectorAll('.dropdown-list'),
      dropdownArray = Array.prototype.slice.call(dropdown, 0);

    dropdownArray.forEach(function(el) {
      var button = el.querySelector('a[dropdown-prop="title"]'),
        menu = el.querySelector('.dropdown-list-items'),
        icon = button.querySelector('i.dropdown-icon'),

        toggleDropdown = function() {
          $(menu).toggleClass('dropdown-list-open');
          $(icon).toggleClass('dropdown-icon-open');
        };

      button.addEventListener('click', toggleDropdown);
    });
  },

  extractFromJSONLD: function(value, key) {
    if (key[0] !== '@') {
      var k = key.replace('http://data.duraark.eu/vocab/', ''),
        values = [];

      _.each(value, function(item) {
        console.log('key: ' + k + ' | value: ' + item['@value']);

        var v = item['@value'];

        if (v && v !== '') {
          values.push(v);
        }
      });

      return {
        key: k,
        values: values
      };
    }

    return null;
  }
});
