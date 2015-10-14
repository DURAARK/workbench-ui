import $ from 'jquery';

function TopicCrawler(opts) {
  this.apiEndpoint = opts.apiEndpoint;
}

TopicCrawler.prototype.initiateCrawl = function(topic, params) {
  console.log('Initiating crawl to: ' + this.apiEndpoint);

  var that = this;

  // var url = this.apiEndpoint + '/topics';

  var seeds = topic.seeds.join(';');
  var url = that.apiEndpoint.host + '/crawls?seeds=' + seeds + '&user=' + params.user + '&depth=' + params.depth;

  console.log('url: ' + url);

  return new Ember.RSVP.Promise(function(resolve, reject) {
    return that._post(url, topic).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
}

TopicCrawler.prototype.getCandidates = function(crawlId) {
  console.log('Getting candidates for crawlId: ' + crawlId);

  var that = this;

  // var url = this.apiEndpoint.host + '/crawls?crawl_id=' + crawlId;
  var url = this.apiEndpoint.host + '/loadCrawl',
    data = {
      crawl_id: crawlId
    };

  // var seeds = topic.seeds.join(';');
  // var url = that.apiEndpoint + 'crawl?seeds=' + seeds + '&user=' + params.user + '&depth=' + params.depth;
  //
  console.log('url: ' + url);

  return new Ember.RSVP.Promise(function(resolve, reject) {
    return that._post(url, data).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
}

TopicCrawler.prototype._get = function(url) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    var jqxhr = Ember.$.get(url, handler);

    jqxhr.fail(function() {
      reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
    });
  });
}

TopicCrawler.prototype._post = function(url, data) {
  var that = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[MetadataExtractionAPIMixin::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    Ember.$.post(url, data, handler);
  });
}
export default TopicCrawler;
