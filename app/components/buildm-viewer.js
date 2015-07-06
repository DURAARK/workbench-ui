import Ember from 'ember';

export default Ember.Component.extend({
  physicalAsset: function() {
    var pa = this.get('file.metadata.physicalAsset'),
      result = [];

    _.each(pa, function(value, key) {
      if (key[0] !== '@') {
        var k = key.replace('http://data.duraark.eu/vocab/', ''),
        values = [];

        _.each(value, function(item) {
          console.log('key: ' + k + ' | value: ' + item['@value']);
          values.push(item['@value']);
        });

        result.push({
          key: k,
          values: values
        });
      }
    });

    return result;
  }.property('file'),

  digitalObject: function() {
    var da = this.get('file.metadata.digitalObject'),
      result = [];

    _.each(da, function(value, key) {
      if (key[0] !== '@') {
        var k = key.replace('http://data.duraark.eu/vocab/', ''),
          values = [];

        _.each(value, function(item) {
          console.log('key: ' + k + ' | value: ' + item['@value']);
          values.push(item['@value']);
        });

        result.push({
          key: k,
          values: values
        });
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
  }
});
