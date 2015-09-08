import Ember from 'ember';

export
default Ember.Component.extend({
  didInsertElement: function(item) {
    var circle = document.querySelector('.material-btn');
    var link = document.querySelector('.material-content').querySelectorAll('li');
    var ham = document.querySelector('.material-hamburger');
    var main = document.querySelector('main');
    var win = window;

    function openMenu(event) {

      circle.classList.toggle('active');
      ham.classList.toggle('material-close');
      main.classList.toggle('active');
      for (var i = 0; i < link.length; i++) {
        link[i].classList.toggle('active');
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function closeMenu() {
      if (circle.classList.contains('active')) {
        circle.classList.remove('active');
        for (var i = 0; i < link.length; i++) {
          link[i].classList.toggle('active');
        }
        ham.classList.remove('material-close');
        main.classList.remove('active');
      }
    }

    circle.addEventListener('click', openMenu, false);

    //win.addEventListener('click', closeMenu, false);
  }
});
