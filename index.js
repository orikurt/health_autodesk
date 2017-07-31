let express = require('express');
let bodyParser = require('body-parser');
let request = require('request-promise');
let async = require('async');

let config = require('./config.json');
let service_module = require('./service_module');
let db = require('./db');
let utils = require('./utils');

let app = express();
let router = express.Router();

router.get('/services', (req, res)=>{
    let services = {};
    async.eachOf(service_module.services, (service, name, cb)=>{
        services[name] = {};
        service_module.get_status(service).then((status)=> {
            services[name].healthy = status;
            services[name].availability = utils.calculate_availability( db.get_queue(name) ) + "%";
            cb();
        }, (err)=>{
                console.error(name, "ERROR: ", err);
                cb(err);
            });
    }, (error)=>{
        if (error){
            res.sendStatus(500);
        }
        else{
            res.json(services);
        }
    });
});

router.get('/health/:service_name/', (req, res)=>{
    let service = service_module.services[req.params.service_name];
    if (!service){
        res.sendStatus(404);
    }
    else{
        service_module.get_status(service).then((status)=>{
            res.send({healthy: status});
        }, (error)=>{
            res.sendStatus(500, error);
        })
    }
});

router.get('/availability/:service_name/', (req, res)=>{
    let service = service_module.services[req.params.service_name];
    if (!service){
        res.sendStatus(404);
    }
    else{
        try{
            let availability = utils.calculate_availability( db.get_queue(req.params.service_name) );
            if (availability >= 0){
                res.json({availability: availability + "%"});
            }
            else{
                res.sendStatus(404);
            }
        }
        catch(e){
            res.sendStatus(500, e);
        }
    }
})

app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(config.port, function(){
    console.log('Server running on port %s', config.port);

    let interval = setInterval(function(){
        async.eachOf(service_module.services, (service, name, cb)=>{
            service_module.get_status(service).then((status)=> {
                db.push(name, status);
                cb();
            }, (err)=>{
                console.error(name, "ERROR: ", err);
                cb(err);
            });            
        }, (err)=>{});    
    }, config.sample_interval);
});