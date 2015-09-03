import Ember from 'ember';

export default Ember.Component.extend({
  overview: function() {
    var techMD = this.get('file.techMD.application/json'),
      result = [],
      controller = this;

    // techMD = JSON.parse(techMD);

    console.log('techMD: ' + JSON.stringify(techMD, null, 4));

    if (!techMD) {
      return [];
    }

    _.each(techMD.ifcm.header, function(value, key) {
      if (key !== 'authorization' && key !== 'name') {
        result.push({
          key: key,
          values: [value]
        });
      }
    });

    _.each(techMD.ifcm.quantities, function(value, key) {
      result.push({
        key: key,
        values: [value]
      });
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
