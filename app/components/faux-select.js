import Ember from 'ember';

export default Ember.Component.extend({
  selected: 'Choose One',
  filterName: 'none',

  change: function(e) {
    this.set('selected', e.target.value);
  },

  selectedChanged: function() {
    let selected = this.get('selected');
    console.log('selected: ' + JSON.stringify(selected, null, 4));
    this.sendAction('onSelectedChange', {
      filterName: this.get('filterName'),
      selected: selected
    });
  }.observes('selected')
});
