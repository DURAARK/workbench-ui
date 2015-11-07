import Ember from 'ember';

export default Ember.Component.extend({
  events: [],

  eventsChanged: function() {
    let events = this.get('events');
    let lastEvent = events.get('lastObject');

    this.schedulePopup(lastEvent);
  }.observes('events.[]'),

  schedulePopup(event) {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $.notify(event.label, event.type);
    });
  }
});
