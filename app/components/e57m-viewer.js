import Ember from 'ember';

export default Ember.Component.extend({
  overview: function() {
    var techMD = this.get('file.techMD.application/json'),
      result = [],
      controller = this;

    techMD = JSON.parse(techMD);

    if (!techMD) {
      return [];
    }

    _.each(techMD.e57m.e57scan, function(value, key) {
      if (key !== 'sensor_hardware_version' &&
        key !== 'temperature' &&
        key !== 'relative_humidity' &&
        key !== 'atmospheric_pressure' &&
        key !== 'pose' &&
        key !== 'index_bounds' &&
        key !== 'cartesian_bounds' &&
        key !== 'sphericalbounds' &&
        key !== 'intensity_limits' &&
        key !== 'color_limits' &&
        key !== 'pointSize' &&
        key !== 'point_fields') {

        if (key === 'description' || key === 'sensor_firmware_version') {
          value = _.unescape(value);
        }

        result.push({
          key: key,
          values: [value]
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
