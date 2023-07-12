const House = require('./entities/House');
const Clock = require('../utils/Clock');
const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const PlanningGoal = require('../pddl/PlanningGoal');

const {SensorPresenceGoal, SensorPresenceIntention} = require('./agents/PresenceSensorAgent');
const {LightsGoal, LightsIntention} = require('./agents/LightAgent');
const {BoilersGoal, BoilersIntention} = require('./agents/BoilerAgent');
const {HouseAgent,HouseGoal,HouseIntention} = require('./agents/HouseAgent');
const pddlActionIntention = require('../pddl/actions/pddlActionIntention')

var house = new House();

/* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
*/

/* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
*/

Clock.global.observe('mm', (key,mm) =>{
    var time = Clock.global

    // Simulation of a typical routine during the week:
    if(time.dd <5){
        if(time.hh == 7 && time.mm == 0){
            house.people.simone.in_room = 'kitchen';
            house.people.marianna.in_room = 'masterBedroom';
        }
        if(time.hh == 7 && time.mm == 30){
            house.people.simone.in_room = 'groundLiving';
            house.people.marianna.in_room = 'privateBathroom';
        }
        if(time.hh == 8 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'drawer';
        }
        if(time.hh == 9 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'firstLiving';
        }
        if(time.hh == 10 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 11 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'kitchen';
        }
        if(time.hh == 12 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'groundLiving';
        }
        if(time.hh == 13 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'kitchen';
        }
        if(time.hh == 14 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 15 && time.mm == 30){
            house.people.simone.in_room = 'lobby';
            house.people.marianna.in_room = 'firstLiving';
        }
        if(time.hh == 16 && time.mm == 30){
            house.people.simone.in_room = 'stairs';
            house.people.marianna.in_room = 'firstLiving';
        }
        if(time.hh == 18 && time.mm == 30){
            house.people.simone.in_room = 'kitchen';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 19 && time.mm == 0){
            house.people.simone.in_room = 'kitchen';
            house.people.marianna.in_room = 'kitchen';
        }
        if(time.hh == 21 && time.mm == 0){
            house.people.simone.in_room = 'stairs';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 22 && time.mm == 0){
            house.people.simone.in_room = 'firstLiving';
            house.people.marianna.in_room = 'firstLiving';
        }
        if(time.hh == 22 && time.mm == 10){
            house.people.simone.in_room = 'drawer';
            house.people.marianna.in_room = 'drawer';
        }
        if(time.hh == 22 && time.mm == 30){
            house.people.simone.in_room = 'privateBathroom';
            house.people.marianna.in_room = 'privateBathroom';
        }
        if(time.hh == 22 && time.mm == 30){
            house.people.simone.in_room = 'masterBedroom';
            house.people.marianna.in_room = 'masterBedroom';
        }

    }

    // Instead, on weekends without Grand Prixes:
    else{
        if(time.hh == 9 && time.mm == 30){
            house.people.simone.in_room = 'masterBedroom';
            house.people.marianna.in_room = 'masterBedroom';
        }
        if(time.hh == 9 && time.mm == 30){
            house.people.simone.in_room = 'privateBathroom';
            house.people.marianna.in_room = 'privateBathroom';
        }
        if(time.hh == 10 && time.mm == 0){
            house.people.simone.in_room = 'drawer';
            house.people.marianna.in_room = 'drawer';
        }
        if(time.hh == 10 && time.mm == 10){
            house.people.simone.in_room = 'stairs';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 10 && time.mm == 30){
            house.people.simone.in_room = 'lobby';
            house.people.marianna.in_room = 'stairs';
        }
        if(time.hh == 10 && time.mm == 50){
            house.people.simone.in_room = 'lobby';
            house.people.marianna.in_room = 'lobby';
        }
        if(time.hh == 11 && time.mm == 0){
            house.people.simone.in_room = 'away';
            house.people.marianna.in_room = 'away';
        }
        if(time.hh == 22 && time.mm == 0){
            house.people.simone.in_room = 'lobby';
            house.people.marianna.in_room = 'lobby';
        }
        if(time.hh == 22 && time.mm == 30){
            house.people.simone.in_room = 'firstLiving';
            house.people.marianna.in_room = 'firstLiving';
        }
    }
});


const ha = new HouseAgent("house");
{
    class Move extends pddlActionIntention{
        static parameters = ['robot','room1','room2','charge_point'];
        static precondition = [ ['is_in_current','robot', 'room1'], ['is_adjacent','room1','room2']];
        static effect = [ ['not is_in_current', 'robot','room1'], ['is_in_current','robot' ,'room2'],['not is_in_charge_point', 'charge_point', 'robot'] ];
        *exec ({room1, room2}=parameters) {
            yield ha.move({room1, room2, robot: this.agent.name})
        }
    }

    class Sprinkle extends pddlActionIntention{
        static parameters = ['room', 'robot'];
        static precondition = [ ['is_in_current', 'robot','room'], ['needs_water', 'room']];
        static effect = [ ['not needs_water', 'room']];
        *exec ({room}=parameters) {
            yield ha.sprinkle({room, robot: this.agent.name})
        }
    }

    class Recharge extends pddlActionIntention{
        static parameters = ['robot','charge_point','room'];
        static duration = 2;
        static precondition = [ ['is_in_current', 'robot','room'], ['chargePoint_in_room', 'charge_point','room'],['not is_in_charge_point', 'charge_point', 'robot']];
        static effect = [ ['is_in_charge_point', 'charge_point','robot'] ];
        *exec ({room, charge_point}=parameters) {
            yield ha.recharge({room, charge_point, robot: this.agent.name})
        }
    }

    class RetryGoal extends Goal {}

    class RetryIntention extends Intention {
        static applicable (goal) {
            return goal instanceof RetryGoal
        }
        *exec ({goal}=parameters) {
            for(let i=0; i<1000; i++) {
                let goalAchieved = yield this.agent.postSubGoal( goal )
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
                yield ha.beliefs.notifyAnyChange()
            }
        }
    }

    var sprinkleR1 = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        let arg2 = key.split(' ')[2]
        if (predicate == 'is_in_current')
            key = 'is_in_current '+ arg1 + ' ' + arg2
        else if (predicate == 'chargePoint_in_room')
            key =  'chargePoint_in_room ' + arg1 + ' ' + arg2
        else if (predicate == 'needs_water')
            key = 'needs_water ' + arg1
        else if (predicate == 'is_adjacent')
            key = 'is_adjacent ' + arg1 + ' ' + arg2
        else if (predicate == 'is_in_charge_point')
            key = 'is_in_charge_point ' + arg1 + ' ' + arg2
        else
            return;
    
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    };

    var sprinkleR2 = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        let arg2 = key.split(' ')[2]
        if (predicate == 'is_in_current')
            key = 'is_in_current ' + arg1 + ' ' + arg2
        else if (predicate == 'chargePoint_in_room')
            key =  'chargePoint_in_room ' + arg1 + ' ' + arg2
        else if (predicate == 'needs_water')
            key = 'needs_water ' + arg1
        else if (predicate == 'is_adjacent')
            key = 'is_adjacent ' + arg1 + ' ' + arg2
        else if (predicate == 'is_in_charge_point')
            key = 'is_in_charge_point ' + arg1 + ' ' + arg2
        else
            return;
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    };

    {
        let robot1 = new Agent('robot1');
        ha.beliefs.observeAny(sprinkleR1(robot1));
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, Sprinkle, Recharge]);
        robot1.intentions.push(OnlinePlanning);
        robot1.intentions.push(RetryIntention);
        robot1.postSubGoal(new RetryGoal({goal: new PlanningGoal(
            {goal: ['not (needs_water lobby)', 
            'not (needs_water stairs)', 
            'not (needs_water groundLiving)', 
            'not (needs_water kitchen)', 
            'not (needs_water laundry)', 
            'is_in_charge_point charge_point1 robot1']})}));
    }
    {
        let robot2 = new Agent('robot2');
        ha.beliefs.observeAny(sprinkleR2(robot2));
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, Sprinkle, Recharge]);
        robot2.intentions.push(OnlinePlanning);
        robot2.intentions.push(RetryIntention);
        robot2.postSubGoal(new RetryGoal({goal: new PlanningGoal(
            {goal: ['not (needs_water masterBedroom)', 
                'not (needs_water smallBedroom)', 
                'not (needs_water privateBathroom)',
                'not (needs_water firstLiving)',
                'not (needs_water drawer)',
                'is_in_charge_point charge_point2 robot2']})}));
    }
}

{
    var lightSensor = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        if (predicate == 'is_empty')
            key = 'is_empty ' + arg1
        else
            return;
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    }
    
    var lightAgent = new Agent('lightAgent')
    ha.beliefs.observeAny( lightSensor(lightAgent) )
    lightAgent.intentions.push(LightsIntention)
    lightAgent.postSubGoal(new LightsGoal(
        [house.lights.l_lobby,
        house.lights.l_stairs,
        house.lights.l_groundLiving,
        house.lights.l_kitchen,
        house.lights.l_laundry,
        house.lights.l_groundBathroom,

        house.lights.l_masterBedroom,
        house.lights.l_smallBedroom,
        house.lights.l_privateBathroom,
        house.lights.l_firstLiving,
        house.lights.l_drawer], 
        house.solarpanel))
}

{
    var boilerSensor = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        if (predicate == 'warming_on')
            key = 'warming_on ' + arg1
        else
            return;
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    }
    var boilerAgent = new Agent('boilerAgent')
    ha.beliefs.observeAny( boilerSensor(boilerAgent) )
    boilerAgent.intentions.push(BoilersIntention)
    boilerAgent.postSubGoal(new BoilersGoal(
        [house.boilers.b_laundry, 
        house.boilers.b_kitchen],
        house.solarpanel))
}

// --------------------------------- ADJANCENCY CONDITIONS ---------------------------------:
/* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
*/
ha.beliefs.declare('is_adjacent lobby stairs');
ha.beliefs.declare('is_adjacent lobby groundLiving');

ha.beliefs.declare('is_adjacent stairs lobby');
ha.beliefs.declare('is_adjacent stairs kitchen');

ha.beliefs.declare('is_adjacent groundLiving lobby');
ha.beliefs.declare('is_adjacent groundLiving kitchen');

ha.beliefs.declare('is_adjacent kitchen groundLiving');
ha.beliefs.declare('is_adjacent kitchen stairs');
ha.beliefs.declare('is_adjacent kitchen laundry');

ha.beliefs.declare('is_adjacent laundry groundBathroom');
ha.beliefs.declare('is_adjacent laundry kitchen');

ha.beliefs.declare('is_adjacent groundBathroom laundry');

/* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
*/
ha.beliefs.declare('is_adjacent masterBedroom privateBathroom');
ha.beliefs.declare('is_adjacent masterBedroom drawer');

ha.beliefs.declare('is_adjacent smallBedroom firstLiving');

ha.beliefs.declare('is_adjacent privateBathroom drawer');
ha.beliefs.declare('is_adjacent privateBathroom masterBedroom');

ha.beliefs.declare('is_adjacent firstLiving smallBedroom');
ha.beliefs.declare('is_adjacent firstLiving drawer');

ha.beliefs.declare('is_adjacent drawer masterBedroom');
ha.beliefs.declare('is_adjacent drawer firstLiving');
ha.beliefs.declare('is_adjacent drawer privateBathroom');


// --------------------------------- ROBOT STARTING CONDITIONS ---------------------------------:
ha.beliefs.declare('chargePoint_in_room charge_point2 firstLiving')
ha.beliefs.declare('chargePoint_in_room charge_point1 lobby')
ha.beliefs.declare('is_in_current robot2 firstLiving')
ha.beliefs.declare('is_in_current robot1 lobby')
ha.beliefs.declare('is_in_charge_point charge_point2 robot2')
ha.beliefs.declare('is_in_charge_point charge_point1 robot1')


// ---------------------------------ROOMS STARTING CONDITIONS ---------------------------------:
/* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
*/
ha.beliefs.declare('needs_water lobby') 
ha.beliefs.declare('needs_water stairs') 
ha.beliefs.declare('needs_water groundLiving') 
ha.beliefs.declare('needs_water kitchen') 
ha.beliefs.declare('needs_water laundry') 
ha.beliefs.declare('needs_water groundBathroom') 

/* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
*/
ha.beliefs.declare('needs_water masterBedroom')
ha.beliefs.declare('needs_water smallBedroom')
ha.beliefs.declare('needs_water privateBathroom')
ha.beliefs.declare('needs_water firstLiving')
ha.beliefs.declare('needs_water drawer')

// --------------------------------- ROOMS EMPTYNESS CONDITIONS ---------------------------------:
/* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
*/
ha.beliefs.declare('is_empty lobby')
ha.beliefs.declare('is_empty stairs')
ha.beliefs.declare('is_empty groundLiving')
ha.beliefs.declare('is_empty kitchen')
ha.beliefs.declare('is_empty laundry')
ha.beliefs.declare('is_empty groundBathroom')

/* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
*/
ha.beliefs.declare('is_empty masterBedroom')
ha.beliefs.declare('is_empty smallBedroom')
ha.beliefs.declare('is_empty privateBathroom')
ha.beliefs.declare('is_empty firstLiving')
ha.beliefs.declare('is_empty drawer')

ha.intentions.push(SensorPresenceIntention)
ha.postSubGoal(new SensorPresenceGoal([house.people.simone, house.people.marianna], 
    [house.rooms.lobby, 
    house.rooms.stairs, 
    house.rooms.groundLiving,
    house.rooms.kitchen,
    house.rooms.laundry, 
    house.rooms.groundBathroom, 

    house.rooms.masterBedroom,
    house.rooms.smallBedroom,
    house.rooms.privateBathroom, 
    house.rooms.firstLiving, 
    house.rooms.drawer]))
ha.intentions.push(HouseIntention)
ha.postSubGoal(new HouseGoal(house))

Clock.startTimer() 
