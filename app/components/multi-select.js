import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  // labelProperty: 'countryName',
  // valueProperty: 'addressCountry',
  choices: null,
  items: null,
  selectedItems: null,

  // NOTE: necessary to not share state between multiple instantiations of this component.
  //       Investigate that ...
  // Possible match: http://stackoverflow.com/questions/26183693/ember-component-properties-not-acting-isolated
  // init() {
  //   this._super();
  //   this.set('items', Ember.A());
  // },

  choicesChanged: function() {
    let items = this.get('items'),
      choices = this.get('choices');

    if (items) {
      items.clear();
    } else {
      items = [];
      this.set('items', items);
    }

    if (choices) {
      choices.map(choice => {
        items.pushObject(Ember.Object.create({
          label: choice[this.get('labelProperty')],
          id: choice[this.get('valueProperty')],
          isSelected: false
        }));
      });
    } else {
      this.set('choices', Ember.A());
    }

    this.selectedItemsChanged();
    this.send('onSelectionChange');
  }.observes('choices', 'selectedItems').on('init'),

  selectedItemsChanged: function() {
    let selectedItems = this.get('selectedItems');
    if (!selectedItems) {
      selectedItems = [];
      this.set('selectedItems', selectedItems);
    }

    this.get('items').forEach(item => {
      item.set('isSelected', false);
    });

    if (selectedItems.length) {
      this.get('items').forEach(item => {
        selectedItems.forEach(selection => {
          if (selection === item.id) {
            item.set('isSelected', true);
          }
        });
      });
    }
  },

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

        let filter = {
          predicate: this.get('valueProperty'), // FIXXME: rename 'valueProperty' to 'predicate'
          type: this.get('propertyType'),
          values: values,
          userData: selectedItems
        };

        this.sendAction('onSelectionChange', filter);
      }
  }
});
