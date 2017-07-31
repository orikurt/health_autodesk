let chai = require('chai');
let expect = chai.expect;

let service_module = require('../service_module');

describe('services module', ()=>{

    describe('handlers', ()=>{

        describe('healthy services', ()=>{

            let mock_responses = {
                "https://bim360dm-dev.autodesk.com/health?self=true": {
                    status: {
                        overall: "GOOD"
                    }
                },
                "https://commands.bim360dm-dev.autodesk.com/health": {
                    status: {
                        overall: "OK"
                    }                    
                },
                "https://bim360dm-staging.autodesk.com/health?self=true": {
                    status: {
                        overall: "GOOD"
                    }                    
                },
                "https://eventing-dev.api.autodesk.com/hds": {
                    health: '{"ok": 1}'
                },
                "https://360-staging.autodesk.com/health": "<HealthCheck><status>Good</status></HealthCheck>"
            };

            beforeEach(function() {
                requestOriginal = require.cache[ require.resolve('request-promise') ].exports;
                require.cache[ require.resolve('request-promise') ].exports.get = function(url) {
                    return new Promise((resolve, reject)=>{
                        let response = mock_responses[url];
                        resolve(response);
                    });
                };
            });

            afterEach(function() {
                
                require.cache[ require.resolve('request-promise') ].exports = requestOriginal;
                
            });

            Object.keys(service_module.services).forEach(function(name) {
                it('should say ' + name + 'is healthy', (done)=>{
                    service_module.get_status( service_module.services[name] ).then((status)=>{
                        expect(status).to.equal(true);
                        done();
                    }).catch((e)=>{
                        done(e);
                    });
                });                
            }, this);
        });

        describe('sick services', ()=>{

            let mock_responses = {
                "https://bim360dm-dev.autodesk.com/health?self=true": {
                    status: {
                        overall: "BAD"
                    }
                },
                "https://commands.bim360dm-dev.autodesk.com/health": {
                    status: {
                        overall: "NOT OK"
                    }                    
                },
                "https://bim360dm-staging.autodesk.com/health?self=true": {
                    status: {
                        overall: "BAD"
                    }                    
                },
                "https://eventing-dev.api.autodesk.com/hds": {
                    health: '{"ok": 0}'
                },
                "https://360-staging.autodesk.com/health": "<HealthCheck><status>Bad</status></HealthCheck>"
            };

            beforeEach(function() {
                requestOriginal = require.cache[ require.resolve('request-promise') ].exports;
                require.cache[ require.resolve('request-promise') ].exports.get = function(url) {
                    return new Promise((resolve, reject)=>{
                        let response = mock_responses[url];
                        resolve(response);
                    });
                };
            });

            afterEach(function() {
                
                require.cache[ require.resolve('request-promise') ].exports = requestOriginal;
                
            });

            Object.keys(service_module.services).forEach(function(name) {
                it('should say ' + name + 'is sick', (done)=>{
                    service_module.get_status( service_module.services[name] ).then((status)=>{
                        expect(status).to.equal(false);
                        done();
                    }).catch((e)=>{
                        done(e);
                    });
                });                
            }, this);
        });        

    });
});
