import Ember from 'ember';

export function stripNamespace(params/*, hash*/) {
  return params[0].split('/').pop();
}

export default Ember.HTMLBars.makeBoundHelper(stripNamespace);
