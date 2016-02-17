import Ember from 'ember';

export function getProp(params /*, hash*/ ) {
  var prop = params[0][params[1]].value;
  // prop = decodeURIComponent(prop.split('/').pop().replace('_', ' '));
  // console.log('prop: ' + prop);
  return prop;
}

export default Ember.HTMLBars.makeBoundHelper(getProp);
