import Ember from 'ember';

export function formatNumber(params) {
  let number = params[0],
  format = params[1];

  return numeral(number).format(format);
}

export default Ember.HTMLBars.makeBoundHelper(formatNumber);
