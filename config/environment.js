/* jshint node: true */

var apiEndpoint = 'http://juliet.cgv.tugraz.at/api/v0.1';

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'workbench-ui',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
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
                host: apiEndpoint + '/sip'
            },
            files: {
                host: apiEndpoint + '/storage'
            },
            stages: {
                host: apiEndpoint + '/sip/stages'
            },
            ifcmetadata: {
                host: apiEndpoint + '/ifcmetadata',
                // The endpoint where the current jobs ('pending' and 'finished') are returned
                jobsEndpoint: '/ifcm',
                // The endpoint where an extraction job can be posted
                extractEndpoint: '/ifcm/extract',
                // TODO: the JSON response from the API has one parent key, which is
                // denoted here. Think on a generic key, e.g. 'metadata', to unify the
                // handling in the APIIfcMetadata and APIE57Metadata binding!
                responseKey: 'ifcms'
            },
            e57metadata: {
                host: apiEndpoint + '/e57metadata',
                jobsEndpoint: '/e57m',
                extractEndpoint: '/e57m/extract',
                responseKey: 'e57ms'
            }
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;


        // Overwrite API endpoints for development environment:
        apiEndpoint = 'http://localhost';

        ENV.DURAARKAPI = {
            sessions: {
                host: apiEndpoint + ':5004'
            },
            files: {
                host: apiEndpoint + ':5001'
            },
            ifcmetadata: {
                host: apiEndpoint + ':5002',
                jobsEndpoint: '/ifcm',
                extractEndpoint: '/ifcm/extract',
                responseKey: 'ifcms'
            },
            e57metadata: {
                host: apiEndpoint + ':5003',
                jobsEndpoint: '/e57m',
                extractEndpoint: '/e57m/extract',
                responseKey: 'e57ms'
            },
        };
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