import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
      this._render();
    },

    urlChanged: function() {
      console.log('asdfasdfasdf');
      this._render();
    }.observes('url'),

    _render() {
      x3dom.reload();

      setTimeout(function() {
        document.getElementById('SCENE').runtime.showAll();
      }, 200);
    },
});
