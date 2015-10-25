import Ember from 'ember';

export default Ember.Component.extend({
  choices: [],
  items: [],
  initialSelection: [],

  onChoicesChange: function() {
    let items = this.get('items');
    this.get('choices').map(choice => {
      items.pushObject(Ember.Object.create({
        label: choice.label,
        id: choice.code,
        isSelected: false
      }));
    });

    let initialSelection = this.get('initialSelection');

    this.get('items').forEach(item => {
      initialSelection.forEach(selection => {
        if (selection === item.id) {
          item.set('isSelected', true);
        }
      })
    });

    this.send('onSelectionChange');
  }.observes('choices'),

  actions: {
    toggleSelection(item) {
        item.toggleProperty('isSelected');
        this.send('onSelectionChange');
      },

      onSelectionChange() {
        let selectedItems = this.get('items').filterBy('isSelected');
        let onlyLabels = selectedItems.map(item => {
          return item.id;
        });

        let selection = {};
        selection[this.get('selectionName')] = onlyLabels;
        console.log('selection: ' + JSON.stringify(selection, null, 4));
        this.sendAction('onSelectionChange', selection);
      }
  }
});
