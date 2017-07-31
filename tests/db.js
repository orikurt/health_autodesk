let chai = require('chai');
let expect = chai.expect;
let db = require('../db');
let config = require('../config.json');

describe('database', ()=>{

    it('should create test queue', ()=>{
        db.create_queue('test');
        expect(db.data['test']).to.deep.equal([]);
    });

    it('should add to queue', ()=>{
        db.push('test', true);
        expect(db.data['test']).to.deep.equal([true]);
    });

    it('should cap queue at max size', ()=>{
        for (var i=0; i<(config.db.max_size * 2); i++){
            db.push('test', true);        
        }
        expect(db.data['test'].length).to.equal(config.db.max_size);
    });

});