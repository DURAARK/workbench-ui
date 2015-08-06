import Ember from 'ember';

export function getProp(params /*, hash*/ ) {
  var prop = params[0][params[1]].value;
  var stripped = prop.split('/').pop();

  if (!stripped) {
    var split = prop.split('/');
    stripped = split[split.length - 2];
  }

  return stripped;
}

export default Ember.HTMLBars.makeBoundHelper(getProp);
