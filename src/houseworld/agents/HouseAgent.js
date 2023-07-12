const Agent = require('../../bdi/Agent');
const pddlActionIntention = require('../../pddl/actions/pddlActionIntention');
const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');

class FakeAction{
    constructor(agent, parameters){
        this.agent = agent;
        this.parameters = parameters;
    }

    get precondition () {
        return pddlActionIntention.ground(this.constructor.preconditions, this.parameters);
    }
    
    checkPrecondition () {
        return this.agent.beliefs.check(this.precondition);
    }

    get effect () {
        return pddlActionIntention.ground(this.constructor.effect, this.parameters);
    }

    applyEffect () {
        for ( let b of this.effect )
            this.agent.beliefs.apply(b);
    }

    async checkPreconditionAndApplyEffect () {
        if ( this.checkPrecondition() ) {
            this.applyEffect();
            await new Promise(res=>setTimeout(res,this.duration*50));
        }
        else
            throw new Error('pddl precondition not valid');
    }

}

class Move extends FakeAction{
    static parameters = ["robot", "room1", "room2", "base_Station"];
    static preconditions = [["is_in_current", "robot", "room1"],["is_adjacent","room1","room2"]];
    static effect = [["not is_in_current", "robot", "room1"], ["is_in_current", "robot", "room2"], ["not is_in_charge_point", "base_station", "robot"]];
}

class Sprinkle extends FakeAction{
    static parameters = ["room", "robot"];
    static preconditions = [["is_in_current", "robot", "room"], ["needs_water","room"]];
    static effect = [["not needs_water", "room"],["is_clean", "room"]];
}
class Recharge extends FakeAction{
    static parameters = ["robot","base_station","room"];
    static preconditions = [["is_in_current", "robot", "room"], ["chargePoint_in_room", "base_station", "room"], ["not is_in_charge_point","base_station","robot"]];
    static effect = ["is_in_charge_point", "base_station","robot"];
}

class HouseGoal extends Goal{
    constructor(house){
        super();
        this.house = house;
    }
}

class HouseIntention extends Intention{
    constructor(agent, goal){
        super(agent,goal);
        this.house = goal.house;
        this.Clock = Clock.global;
    }

    static applicable (goal) {
        return goal instanceof HouseGoal;
    }

    *exec(){
        while(true){
            var status = yield this.Clock.notifyChange('hh');
            for (let [key_l, light] of Object.entries(this.house.lights)){
                light.computePower(this.Clock);
            }

            for (let [key_u, utils] of Object.entries(this.house.utilities)){
                this.house.utilities.computePower();
            }

            // Define a strategy for warming or cooling the house:
            for (let [key_t, therm] of Object.entries(this.house.thermostats)){
                if(therm.temperature <= 18){
                    this.agent.beliefs.declare('warming');

                    for (let [key_r, room] of Object.entries(this.house.rooms)){
                        room.thermostat.set('status', true);
                    }
                }
                else if(therm.temperature >= 23 && therm.temperature < 26){
                    this.agent.beliefs.undeclare('warming')

                    this.agent.beliefs.undeclare('cooling');
                }
                else if(therm.temperature >= 26){
                    this.agent.beliefs.declare('cooling');
                    for (let [key_r, room] of Object.entries(this.house.rooms)){
                        room.thermostat.set('status', false);
                    }
                }
                therm.computePower(this.Clock);
            }

            // Update temperatures:
            for (let [key_r, room] of Object.entries(this.house.rooms)){
                if (key_r != 'away'){
                    room.update_temperature();
                }
            }

            // for (let [key_b, boiler] of Object.entries(this.house.boilers)){
            //     boiler.warmingMethane();
            // }

            // Check how much power we consumed:
            if (this.Clock.hh==0){
                console.log('Watts consumed today: ' + this.house.total_consumption +' W');
                this.house.total_consumption = 0;
            }
        }
    }
}

class HouseAgent extends Agent{
    constructor (name){
        super(name);
    }

    move({room1 , room2, robot} = args) {
        this.log('move', room1 , room2, robot);
        return new Move(this, {room1 , room2, robot} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('HouseAgent.move failed:', err.message || err); throw err;});
    }

    sprinkle({robot, room} = args) {
        this.log('sprinkle', robot, room,);
        return new Sprinkle(this, {robot, room} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('HouseAgent.sprinkle failed:', err.message || err); throw err;});
    }

    recharge({robot, room, base_station} = args) {
        this.log('recharge', robot, room, base_station);
        return new Recharge(this, {robot, room, base_station} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('HouseAgent.recharge failed:', err.message || err); throw err;});
    }
}

module.exports = {HouseAgent,HouseGoal,HouseIntention};
