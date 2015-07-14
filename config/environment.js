/* jshint node: true */

var os = require('os'),
  hostname = os.hostname(),
  // FIXXME: find a GUI configurable way to do that!
  apiEndpoint = process.env.DURAARK_API_ENDPOINT;

console.log('[workbench-ui] Started on host: ' + hostname);
console.log('[workbench-ui] (debug) DURAARK_API_ENDPOINT: ' + process.env.DURAARK_API_ENDPOINT);

if (!apiEndpoint) {
  apiEndpoint = 'http://' + hostname;
  console.log('[workbench-ui] No DURAARK_API_ENDPOINT environment variable defined, using "' + apiEndpoint + '"');
} else {
  console.log('[workbench-ui] API endpoint URL: ' + apiEndpoint);
}

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'workbench-ui',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self' http://schema.rdfs.org/all.json http://localhost:5001 http://localhost:5002 http://localhost:5003 http://localhost:5004 http://localhost:5005 http://localhost:5006",
      'img-src': "'self' a.tiles.mapbox.com",
      'style-src': "'self' 'unsafe-inline'",
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    // Default API endpoing configuration for the DURAARK Platform for
    // *production* environment. For the development environment the
    // config is overwritten below.
    DURAARKAPI: {
      sessions: {
        host: apiEndpoint + ':5011'
      },
      metadata: {
        host: apiEndpoint + ':5012'
      },
      sda: {
        host: apiEndpoint + ':5013'
      },
      // geometricenrichment: {
      //   host: apiEndpoint + ':5014'
      // },
      sipgenerator: {
        host: apiEndpoint + ':5015'
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // if (apiEndpoint === 'http://localhost') {
    //   ENV.DURAARKAPI = {
    //     sessions: {
    //       host: apiEndpoint + ':5001'
    //     },
    //     metadata: {
    //       host: apiEndpoint + ':5002'
    //     },
    //     sipgenerator: {
    //       host: apiEndpoint + ':5007'
    //     },
    //     sda: {
    //       host: apiEndpoint + ':5005'
    //     },
    //     searchItems: {
    //       host: apiEndpoint + ':5005/example'
    //     },
    //     semanticenrichment: {
    //       host: apiEndpoint + ':5006',
    //       jobsEndpoint: '/enrichment',
    //       extractEndpoint: '/enrichment/extract'
    //     },
    //     topicCrawler: {
    //       host: 'http://asev.l3s.uni-hannover.de:9986/api/CrawlAPI/'
    //     }
    //   };
    // }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
