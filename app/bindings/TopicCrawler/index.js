function TopicCrawler(opts) {
  this.apiEndpoint = opts.apiEndpoint;
}

TopicCrawler.prototype.initiateCrawl = function (topics) {
  console.log('Initiating crawl to: ' + this.apiEndpoint);
};

TopicCrawler.prototype._get = function (url, params) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        function handler(data, status, jqxhr) {
            if (status === 'success') {
                resolve(data);
            } else {
                reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            }
        }

        var jqxhr = Ember.$.get(url, params, handler);

        jqxhr.fail(function() {
            reject(new Error('[FocusedCrawlerAPI::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
        });
    });
},

TopicCrawler.prototype._get = function (url, data) {
    var that = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
        function handler(data, status, jqxhr) {
            if (status === 'success') {
                resolve(data);
            } else {
                reject(new Error('[FocusedCrawlerAPI::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
            }
        }

        Ember.$.post(url, data, handler);
    });
}

export default TopicCrawler;
