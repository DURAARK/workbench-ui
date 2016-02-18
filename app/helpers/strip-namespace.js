import Ember from 'ember';

export function stripNamespace(params /*, hash*/ ) {
  let url = params[0],
    hasVersion = false;

  hasVersion = (url.split('/version/').length >= 2);

  if (hasVersion) {
    url = url.replace(/\/version\/\d*/, '');
    console.log('url: ' + url);
  }

  return decodeURIComponent(url.split('/').pop().replace('_', ' '));
}

export default Ember.HTMLBars.makeBoundHelper(stripNamespace);
