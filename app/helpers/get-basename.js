import Ember from 'ember';

export function getBasename(params /*, hash*/ ) {
  return params[0].split('/').pop();
}

export default Ember.HTMLBars.makeBoundHelper(getBasename);
