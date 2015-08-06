import Ember from 'ember';

export function getProp(params /*, hash*/ ) {
  var prop = params[0][params[1]].value;
  return prop;
}

export default Ember.HTMLBars.makeBoundHelper(getProp);
