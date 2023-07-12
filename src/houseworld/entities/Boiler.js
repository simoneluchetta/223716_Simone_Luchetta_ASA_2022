const Observable = require("../../utils/Observable");
const Clock = require("../../utils/Clock");

class Boiler extends Observable{
    constructor(house,room){
        super(Boiler);
        this.house = house;
        this.room = room;
        this.capacity = 300;    // Liters in the tank;
        this.temperature = 10;
        this.set('status', false);
        this.set('gas', false);
        this.set('energy', false);
    }

    warmingEnergy(){
        if(this.energy == false)
        {
            this.energy = true;
            this.gas = false;
            console.log(Clock.global.hh + ":" + Clock.global.mm + " - Boiler turned on - Using Solar Panels");
        }
    }

    warmingMethane(){
        if(this.gas == false)
        {
            this.gas = true;
            this.energy = false;
            console.log(Clock.global.hh + ":" + Clock.global.mm + " - Boiler turned on - Using Natural Gas");
        }
    }

    warmingOff(){
        if(this.status == true)
        {
            this.status = false;
            this.energy = false;
            this.gas = false;
            console.log(Clock.global.hh + ":" + Clock.global.mm + " - Boiler turned off");
        }
    }
    
}

module.exports = Boiler;
