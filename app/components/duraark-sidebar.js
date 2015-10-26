import Ember from 'ember';

export default Ember.Component.extend({
  // FIXXME: get correct values for those!
  headerHeight: 64,
  workflowHeight: 40,
  footerHeight: 52,
  offset: 16,

  setFullHeight() {
    let $el = this.$(),
      headerHeight = this.get('headerHeight'),
      footerHeight = this.get('footerHeight'),
      workflowHeight = this.get('workflowHeight'),
      offset = this.get('offset');

    var windowHeight = $(window).height();
    console.log('[duraark-sidebar] windowHeight: ' + windowHeight);

    var sidebarHeight = windowHeight - headerHeight - footerHeight - workflowHeight - offset;

    Ember.run.schedule('afterRender', function() {
      $el.height(sidebarHeight);
    });
  },

  didInsertElement() {
    this.setFullHeight();

    $(window).resize(function() {
      this.setFullHeight();
    }.bind(this));
  }
});
