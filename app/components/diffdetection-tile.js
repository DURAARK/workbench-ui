import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  choices: [{
    label: 'Statsbygg_Rislokka_B1-Arch_PREVIEW.ifc'
  }],
  name: 'diffFile',
  showStart: true,

  actions: {
    remove: function(tool) {
      var item = this.get('item');
      this.sendAction('remove', item, tool);
    },

    infoClicked: function(tool) {
      var item = this.get('item');
      this.sendAction('infoClicked', item, tool);
    },

    startClicked: function() {
      this.set('tool.hasData', true);
      this.set('tool.isLoading', false);
      this.set('tool.hasError', false);
      this.set('showStart', false)
    }
  }
});
