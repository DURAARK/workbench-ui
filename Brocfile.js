/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    funnel = require('broccoli-funnel');

var app = new EmberApp({
	hinting: false
});

// Use `app.import` to add additional libraries to the generated
// output files.

app.import('bower_components/please-wait/build/please-wait.min.js');
app.import('bower_components/please-wait/build/please-wait.css');

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
