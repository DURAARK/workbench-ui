import Ember from 'ember';

export function getNameForPaURI(params /*, hash*/ ) {
  let paURI = params[0],
    hasVersion = false;

  hasVersion = (paURI.split('/version/').length >= 2);

  if (hasVersion) {
    paURI = paURI.replace(/\/version\/\d*/, '');
  }

  console.log('paURI: ' + paURI);

  let param = Ember.$.param(paURI);
  let url = 'http://localhost/api/v0.7/sda/concepts/getNameForPhysicalAssetURI?' + param;

  Ember.$.get(url).then(response => {
    console.log('duraark.js RESULT: ' + JSON.stringify(response, null, 4));
    resolve(response)
  }).fail(function(err) {
    reject(err);
  });
}

export default Ember.HTMLBars.makeBoundHelper(getNameForPaURI);
