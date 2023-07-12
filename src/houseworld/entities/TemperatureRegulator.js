const Clock = require('../../utils/Clock');
const Observable =  require('../../utils/Observable');

class TemperatureRegulator extends Observable{
    constructor(house,room){
        super(TemperatureRegulator);
        this.house = house;
        this.room = room;
        this.temperature = 18;
        this.consumption = 1;
        this.set('status',false);
    }

    turnOn(){
        // If it was shutdown, then...
        if(this.status == false){
            this.status = true;
            console.log(Clock.global.hh + ":" + Clock.global.mm + " - TemperatureRegulator turned on in room " + this.room);
        }
    }

    turnOff(){
        // If it was working, then...
        if(this.status == true){
            this.status = false;
            console.log(Clock.global.hh + ":" + Clock.global.mm + " - TemperatureRegulator turned off in room " + this.room);
        }
    }
    
    computePower(){
        if(this.status == true){
            var time_hh = Clock.global.hh - this.start_hh;
            var time_mm = 0;
            if (Clock.global.hh > this.start_hh){
                time_mm = 60 - this.start_mm + Clock.global.mm;
            }
            else{
                time_mm = Clock.global.mm - this.start_mm;
            }
            this.house.total_consumption += this.consumption*time_hh + ((this.consumption/60)*time_mm);

            this.start_hh = Clock.global.hh;
            this.start_mm = Clock.global.mm;
        }
    }
}

module.exports = TemperatureRegulator;
