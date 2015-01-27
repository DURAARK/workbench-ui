/* jshint node: true */

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
            files: {
                host: 'http://juliet.cgv.tugraz.at',
                port: 5001
            },
            ifcmetadata: {
                host: 'http://juliet.cgv.tugraz.at',
                port: 5002
            },
            e57metadata: {
                host: 'http://juliet.cgv.tugraz.at',
                port: 5003
            }
        }
    }

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;

        // Overwrite API endpoints for development environment:
        ENV.DURAARKAPI = {
            files: {
                host: 'http://localhost',
                port: 5001
            },
            ifcmetadata: {
                host: 'http://localhost',
                port: 5002
            },
            e57metadata: {
                host: 'http://localhost',
                port: 5003
            }
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