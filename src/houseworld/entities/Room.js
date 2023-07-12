const Observable =  require('../../utils/Observable');

class Room extends Observable{
    constructor(house, name, light, thermostat, floor, sprinkling_time, door, boiler = []){
        super(Room);
        this.house = house;
        this.name = name;
        this.light = light;
        this.boiler = boiler;
        this.thermostat = thermostat;
        this.floor = floor;
        this.sprinkling_time = sprinkling_time;
        this.doors_to = door;
        this.set('temperature', 18);
    }

    update_temperature()
    {
        if (this.thermostat.status == true){
            this.temperature += 1;
        } 
        else {
            this.temperature -= 1;
        }
    }
}

module.exports = Room;
