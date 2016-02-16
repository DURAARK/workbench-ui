import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['overflowYScroll:has-overflow-y-scroll', 'overflowYAuto:has-overflow-y-auto'],
  // FIXXME: get correct values for those!
  headerHeigth: 64,
  workflowHeigth: 35,
  footerHeigth: 115,
  // overflowYScroll: true,

  setFullHeigth() {
    let $el = this.$(),
      headerHeigth = this.get('headerHeigth'),
      footerHeigth = this.get('footerHeigth'),
      workflowHeigth = this.get('workflowHeigth');

    var windowHeigth = $(window).height();
    // console.log('[duraark-sidebar] windowHeigth: ' + windowHeigth);

    var sidebarHeigth = windowHeigth - headerHeigth - footerHeigth - workflowHeigth;

    Ember.run.schedule('afterRender', function() {
      $el.height(sidebarHeigth);
    });
  },

  didInsertElement() {
    this.setFullHeigth();

    $(window).resize(function() {
      this.setFullHeigth();
    }.bind(this));
  }
});
