module.exports.calculate_availability = function(samples){
    let total = samples.reduce((total, val)=>{ return total + val; });
    return (total / samples.length) * 100;
};