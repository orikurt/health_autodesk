let config = require('./config.json');
let MAX_SIZE = config.db.max_size;

let self = {
    data: {}
};

self.create_queue = function(name){
    self.data[name] = [];
};

self.push = function(name, val){
    if(!self.get_queue(name)){
        self.create_queue(name);
    }
    if (self.data[name].length === MAX_SIZE){
        self.data[name].shift();
    }

    self.data[name].push(val);
};

self.pop = function(name){
    return self.data[name].pop();
};

self.get_queue = function(name){
    return self.data[name];
};

module.exports = self;