import Ember from 'ember';

export function stripNamespace(params/*, hash*/) {
  return decodeURIComponent(params[0].split('/').pop().replace('_', ' '));
}

export default Ember.HTMLBars.makeBoundHelper(stripNamespace);
