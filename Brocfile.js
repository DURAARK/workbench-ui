/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    funnel = require('broccoli-funnel');

var app = new EmberApp({
	hinting: false
});

// Use `app.import` to add additional libraries to the generated
// output files.

app.import('bower_components/material-design-lite/material.min.css');
app.import('bower_components/material-design-lite/material.min.js');

app.import('vendor/ember-droplet/dist/ember-droplet.js');

app.import('bower_components/leaflet/dist/leaflet.js');
app.import('bower_components/leaflet/dist/leaflet.css');

app.import('vendor/jsc3d/bin/jsc3d.min.js');

app.import('bower_components/underscore/underscore-min.js');

var fontFiles = funnel('bower_components/font-awesome/fonts', {
    destDir: 'fonts'
});

var adaptivePlaceholders = funnel('vendor/adaptive-placeholders', {
    destDir: 'vendor/adaptive-placeholders'
});

funnel('vendor/numeral', {
    destDir: 'vendor/numeral'
});
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree([fontFiles, adaptivePlaceholders]);
