import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['overflowYScroll:has-overflow-y-scroll'],
  // FIXXME: get correct values for those!
  headerHeight: 64,
  workflowHeight: 35,
  footerHeight: 68,
  // overflowYScroll: true,

  setFullHeight() {
    let $el = this.$(),
      headerHeight = this.get('headerHeight'),
      footerHeight = this.get('footerHeight'),
      workflowHeight = this.get('workflowHeight');

    var windowHeight = $(window).height();
    // console.log('[duraark-sidebar] windowHeight: ' + windowHeight);

    var sidebarHeight = windowHeight - headerHeight - footerHeight - workflowHeight;

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
