let parseString = require('xml2js').parseString;
let request = require('request-promise');

let services = {
    "bim360dm-dev": {
        url: "https://bim360dm-dev.autodesk.com/health?self=true",
        handler: (result)=> {
            return new Promise(function(resolve,reject){
                try{
                    resolve(result.status.overall === "GOOD");
                }
                catch(e){
                    reject(e);
                }
            });
        }
    },
    "commands.bim360dm-dev": {
        url: "https://commands.bim360dm-dev.autodesk.com/health",
        handler: (result)=> {
            return new Promise(function(resolve,reject){
                try{
                    resolve(result.status.overall === "OK");
                }
                catch(e){
                    reject(e);
                }
            });
        }
    },
    "bim360dm-staging": {
        url: "https://bim360dm-staging.autodesk.com/health?self=true",
        handler: (result)=> {
            return new Promise(function(resolve,reject){
                try{
                    resolve(result.status.overall === "GOOD");
                }
                catch(e){
                    reject(e);
                }
            });
        }
    },
    "eventing-dev": {
        url: "https://eventing-dev.api.autodesk.com/hds",
        handler: (result)=> {
            return new Promise(function(resolve,reject){
                try{
                    resolve(JSON.parse(result.health).ok === 1);
                }
                catch(e){
                    reject(e);
                }
            });            
        }
    },
    "360-staging": {
        url: "https://360-staging.autodesk.com/health",
        handler: (res)=> {
            return new Promise(function(resolve,reject){
                try{
                    parseString(res, (err, result)=> {
                        if (err){
                            reject(err);
                        }
                        else{
                            resolve(result.HealthCheck.status[0] === "Good");
                        }
                    });
                }
                catch(e){
                    reject(e);
                }
            });
        }
    },
    
};

module.exports.get_status = function(service){
    return request.get(service.url, {json: true}).then(service.handler);    
};


module.exports.services = services;