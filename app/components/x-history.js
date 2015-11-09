import Ember from 'ember';

export default Ember.Component.extend({
  eventHistory: null,

  currentEventChanged: function() {
    let currentEvent = this.get('eventHistory.currentEvent');
    this._handleCurrentEvent(currentEvent);
  }.observes('eventHistory.currentEvent'),

  _handleCurrentEvent(currentEvent) {
    let allEvents = this.get('eventHistory.allEvents'),
      pendingEvents = this.get('eventHistory.pendingEvents');

    switch (currentEvent.eventType) {
      case 'finished':
        let matchingEvent = allEvents.findBy('id', currentEvent.id);
        if (matchingEvent.eventType === 'pending') {
          pendingEvents.removeObject(matchingEvent);
          this._schedulePopup(currentEvent);
        } else {
          console.log('[x-history] No "pending" counterpart event found for this event: ' + currentEvent.label);
        }
        break;
      case 'pending':
        pendingEvents.pushObject(currentEvent);
      default:
        this._schedulePopup(currentEvent);
    }

    allEvents.pushObject(currentEvent);
  },

  _schedulePopup(event) {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $.notify(event.label, event.displayType);
    });
  }
});
