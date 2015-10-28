import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  // labelProperty: 'countryName',
  // valueProperty: 'addressCountry',
  choices: null,
  items: null,
  selectedItems: null,

  // NOTE: necessary to not share state between multiple instantiations of this compoentn.
  //       I have to investigate that if there is time ...
  // Possible match: http://stackoverflow.com/questions/26183693/ember-component-properties-not-acting-isolated
  init() {
    this._super();
    this.set('items', Ember.A());
    if (!this.get('choices')) {
      this.set('choices', Ember.A());
      this.set('selectedItems', Ember.A());
    } else {
      this.onChoicesChange();
    }
  },

  onChoicesChange: function() {
    let items = this.get('items');
    items.clear();

    this.get('choices').map(choice => {
      items.pushObject(Ember.Object.create({
        label: choice[this.get('labelProperty')],
        id: choice[this.get('valueProperty')],
        isSelected: false
      }));
    });

    let selectedItems = this.get('selectedItems');
    if (!selectedItems) {
      selectedItems = [];
      this.set('selectedItems', selectedItems);
    }

    if (selectedItems.length) {
      this.get('items').forEach(item => {
        selectedItems.forEach(selection => {
          if (selection === item.id) {
            item.set('isSelected', true);
          }
        })
      });
    }

    this.send('onSelectionChange');
  }.observes('choices', 'selectedItems'),

  actions: {
    toggleSelection(item) {
        item.toggleProperty('isSelected');
        this.send('onSelectionChange');
      },

      onSelectionChange() {
        let selectedItems = this.get('items').filterBy('isSelected');
        let values = selectedItems.map(item => {
          return item.id;
        });

        // this.set('selectedValues', values);

        let filter = {};
        filter[this.get('valueProperty')] = values;

        let selection = {
          filter: filter,
          data: selectedItems
        };

        this.sendAction('onSelectionChange', selection);
      }
  }
});
