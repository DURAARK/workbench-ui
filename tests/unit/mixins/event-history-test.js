import Ember from 'ember';
import EventHistoryMixin from '../../../mixins/event-history';
import { module, test } from 'qunit';

module('Unit | Mixin | event history');

// Replace this with your real tests.
test('it works', function(assert) {
  var EventHistoryObject = Ember.Object.extend(EventHistoryMixin);
  var subject = EventHistoryObject.create();
  assert.ok(subject);
});
