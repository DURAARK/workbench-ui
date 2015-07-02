import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    console.log('bin da');
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
