const Observable =  require('../../utils/Observable');
const Clock =  require('../../utils/Clock');

class Utilities extends Observable{
    constructor(house, consumption){
    super(Utilities)
    this.house = house;
    this.start_hh = 0;
    this.start_mm = 0;
    this.consumption = consumption;
    this.set('status', false);
    }

    computePower(){
        if(this.status == true){
            var time_hh = Clock.global.hh - this.start_hh;
            var time_mm = 0;
            if(Clock.global.hh > this.start_hh){
                time_mm = 60 - this.start_mm + Clock.global.mm;
            } else {
                time_mm = Clock.global.mm - this.start_mm;
            }
            this.house.total_consumption += this.consumption*time_hh + ((this.consumption/60)*time_mm);

            this.start_hh = Clock.global.hh;
            this.start_mm = Clock.global.mm;
        }
    }
}

module.exports = Utilities;
