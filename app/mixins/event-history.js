import Ember from 'ember';

// FIXXME: how to distribute this object?
export let EventHistory = Ember.Object.extend({
  currentEvent: null,
  pendingEvents: [],
  allEvents: []
});

export let EventHistoryMixin = Ember.Mixin.create({
  actions: {
    addPendingEvent(historyEvent) {
        // FIXXME: not sure yet how to get 'eventHistory' into the mixin
        let eventHistory = this.modelFor('application').get('eventHistory');

        Ember.merge(historyEvent, {
          eventType: 'pending'
        });

        eventHistory.set('currentEvent', historyEvent);
      },

      addFinishedEvent(historyEvent) {
        // FIXXME: not sure yet how to get 'eventHistory' into the mixin
        let eventHistory = this.modelFor('application').get('eventHistory');

        Ember.merge(historyEvent, {
          eventType: 'finished'
        });

        eventHistory.set('currentEvent', historyEvent);
      }
  }
});
