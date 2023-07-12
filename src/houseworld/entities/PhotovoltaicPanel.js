/*
As mentioned, the house contains both, a Solar and a Photovoltaic panel.
Since they work substantially similar one each other, the easy choice taken is to just implement and use the SolarPanel, disregarding the Photovoltaic one.
One could add the PhotovoltaicPanel inside the House.js constructor though, but it's a matter of copy-pasting.
*/

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

        // A gaussian distribution centered on the 12th hour is used as an example of how the panels yield energy:
        var to_return = gaussianRandom(12, 6) * 200;
        console.log("Producing " + to_return + " Watts");
        return to_return;
    }
}

module.exports = SolarPanel;
