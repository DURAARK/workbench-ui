import Ember from 'ember';

export
default Ember.Component.extend({
  name: '',
  address: '',
  description: '',

  actions: {
    createClicked: function() {
      this.sendAction('createClicked', {
        label: this.get('name'),
        address: this.get('address'),
        description: this.get('description'),
        state: 'new'
      });

      this.get('closeMenu')();
    }
  },

  didInsertElement: function(item) {
    var menu = document.querySelector('.material-menu');
    var circle = document.querySelector('.material-btn');
    var link = document.querySelector('.material-content').querySelectorAll('li');
    var ham = document.querySelector('.material-hamburger');
    var main = document.querySelector('main');
    var win = window;

    function openMenu(event) {
      if (!menu.classList.contains('active')) {
        menu.classList.add('active');

        circle.classList.toggle('active');
        ham.classList.toggle('material-close');
        main.classList.toggle('active');
        for (var i = 0; i < link.length; i++) {
          link[i].classList.toggle('active');
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      } else {
        if (circle.classList.contains('active')) {
          circle.classList.remove('active');
          for (var i = 0; i < link.length; i++) {
            link[i].classList.toggle('active');
          }
          ham.classList.remove('material-close');
          main.classList.remove('active');
          menu.classList.remove('active');
        }
      }
    }

    function closeMenu() {
      if (circle.classList.contains('active')) {
        circle.classList.remove('active');
        for (var i = 0; i < link.length; i++) {
          link[i].classList.toggle('active');
        }
        ham.classList.remove('material-close');
        main.classList.remove('active');
        menu.classList.remove('active');
      }
    }

    circle.addEventListener('click', openMenu, false);

    this.set('closeMenu', closeMenu);
  }
});
