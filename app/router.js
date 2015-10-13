import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('preingest', { resetNamespace: true }, function() {
    this.route('index', { path: '/'} );
    this.route('files', { path: ':id/files' });
    this.route('metadata', { path: ':id/metadata' });
    this.route('semanticenrichment', { path: ':id/semanticenrichment' });
    this.route('geometricenrichment', { path: ':id/geometricenrichment' });
    this.route('digitalpreservation', { path: ':id/digitalpreservation' });
  });

  this.route('search', { resetNamespace: true });
  this.route('explore', { path: '/explore' });

  this.route('ifc-viewer');
  
  // this.route('admin');
  // this.route('file-browser');
});

export default Router;
