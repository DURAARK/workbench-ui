import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',

  actions: {
    selectItem: function(item) {
      this.sendAction('select', item);
    },
    showDetails: function(item) {
      this.sendAction('details', item);
    },
    downloadFile: function(item) {
      // FIXXME: expose 'sessions' folder from 'duraark-sessions'!
      let url = item.get('path').replace('/duraark-storage', '/api/v0.7/geometricenrichment');

      console.log('Downloading filr from URL: ' + url);
      downloadURL(url);
    },
  },

  filename: function() {
    var path = this.get('item.path');
    if (path) {
      return path.split('/').pop();
    }

    return '';
  }.property('item'),

  size: function() {
    var size = this.get('item.size');
    return numeral(size).format('0 b');
  }.property('item'),

  extension: function() {
    var path = this.get('item.path');
    if (path) {
      var exts = _getFileExtension(path);
      if (exts && exts.length) {
        return exts[0]
      } else {
        return 'no extension';
      }
    }

    return '';
  }.property('item'),

  isIFC: function() {
    var ext = this.get('extension').toLowerCase();

    return ext === 'ifc';
  }.property('extension'),

  isE57: function() {
    var ext = this.get('extension').toLowerCase();
    return ext === 'e57';
  }.property('extension')
});

function _getFileExtension(filepath) {
  return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

function downloadURL(url) {
  var hiddenIFrameID = 'hiddenDownloader',
    iframe = document.getElementById(hiddenIFrameID);
  if (iframe === null) {
    iframe = document.createElement('iframe');
    iframe.id = hiddenIFrameID;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  iframe.src = url;
};
