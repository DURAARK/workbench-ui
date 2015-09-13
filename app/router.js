import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('preingest', { resetNamespace: true }, function() {
    this.route('index', { path: '/'} );
    this.route('files', { path: ':id/files' });
  });

  this.route('retrieve', { resetNamespace: true });

  // this.route('files', { path: '/files/:id' });
  this.route('metadata', { path: '/metadata/:id' });
  this.route('semanticenrichment', { path: '/semanticenrichment/:id' });
  this.route('geometricenrichment', { path: '/geometricenrichment/:id' });
  this.route('digitalpreservation', { path: '/digitalpreservation/:id' });

  this.route('searchretrieve', { path: '/searchretrieve' });
  this.route('admin');
  this.route('file-browser');
});

export default Router;
