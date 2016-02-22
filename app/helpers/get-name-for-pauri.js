import Ember from 'ember';

export function getNameForPaURI(params /*, hash*/ ) {
  let paURI = params[0],
    hasVersion = false;

  hasVersion = (paURI.split('/version/').length >= 2);

  if (hasVersion) {
    paURI = paURI.replace(/\/version\/\d*/, '');
  }

  let paramConfig = {
    paURI: paURI
  };

  console.log('paramConfig: ' + JSON.stringify(paramConfig, null, 4));

  let paramString = Ember.$.param(paramConfig);
  let url = 'http://localhost/api/v0.7/sda/concepts/getNameForPhysicalAssetURI?' + paramString;

  var value = Ember.Object.create({
    name: paURI
  });

  return value;
  
  new Ember.RSVP.Promise((resolve, reject) => {
    Ember.$.get(url).then(response => {
      if (response.name) {
        console.log('duraark.js NAME: ' + response.name);
        value.set('name', response.name);
      }
    })
  });
}

export default Ember.HTMLBars.makeBoundHelper(getNameForPaURI);
