const Observable =  require('../../utils/Observable');

class Person extends Observable{
    constructor (house,name,room){
        super(Person);
        this.house = house;
        this.name = name;
        this.set('is_in_current', room);
    }
    moveTo(room){
        if(room in this.house.rooms[this.in_room].doors_to || this.in_room in this.house.rooms[to].doors_to){
            person.in_room = room;
            return true;
        }
        else{
            return false
        }
    }
}

module.exports = Person;
