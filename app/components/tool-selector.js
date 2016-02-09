import Ember from 'ember';

export default Ember.Component.extend({
  applicableTools: function() {
    let digitalObject = this.get('digitalObject'),
      tools = this.get('tools'),
      fileEnding = digitalObject.path.split('.').pop();

    console.log('Setting tools for: ' + fileEnding);

    let applicableTools = tools.filter(function(tool) {
      return _.contains(tool.fileType, fileEnding);
    });

    return applicableTools;
  }.property('digitalObject'),

  title: function() {
      let fileType = (this.get('digitalObject.path').endsWith('.ifc')) ? 'BIM Model' : 'Point Cloud';
      return 'Available ' + fileType + ' Tools:';
  }.property('digitalObject'),

  actions: {
    click: function(tool) {
      // FIXXME: find a more generic solution!
      if (tool.get('label') === "Difference Detection" && this.get('numFiles') <= 1) {
        return;
      }

      tool.toggleProperty('isSelected');
      this.sendAction('click', tool);
    }
  }
});
