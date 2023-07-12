const Observable = require('../../utils/Observable');
const Clock =  require('../../utils/Clock');

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

class SolarPanel extends Observable{
    constructor(house){
        super(SolarPanel)
        this.house = house;
    }

    getEnergy(){
        var time_hh = Clock.global.hh;
        var time_mm = Clock.global.mm;
        var time = (time_mm / 60) + time_hh;

        var to_return = 0;
        
        // As defined in the report:
        if(time.hh <= 8 && time.hh >= 0){
            return to_return = 0;
        }
        else if(time.hh > 8 && time.hh <= 10){
            return to_return = 1000;
        }
        else if(time.hh > 10 && time.hh <= 15){
            return to_return = 2000;
        }
        else if(time.hh > 15 && time.hh <= 20){
            return to_return = 1000;
        }
        else{
            return to_return = 0;
        }
        
        // Or just:
        // to_return = gaussianRandom(12, 6) * 200;
        // console.log("Producing " + to_return + " Watts");
        // return to_return;
    }
}

module.exports = SolarPanel;
