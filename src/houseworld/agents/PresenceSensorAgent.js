const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');

class SensorPresenceGoal extends Goal{
    constructor(persons, rooms){
        super();
        this.persons = persons;
        this.rooms = rooms;
    }
}

class SensorPresenceIntention extends Intention{
    constructor(agent, goal){
        super(agent,goal);
        this.persons = this.goal.persons;
        this.rooms = this.goal.rooms;
    }
    static applicable (goal){
        return goal instanceof SensorPresenceGoal;
    }
    *exec(){
        var m_goal = [];
        for(let p of this.persons){
            let presenceGoalPromise = new Promise( async res => {
                while (true) {
                    let room = await p.notifyChange('in_room');
                    this.agent.beliefs.undeclare('is_empty '+ room);
                    for(let r of this.rooms){
                        var in_room = false;
                        for (let person of this.persons){
                            if (r.name == person.in_room){
                                in_room = true
                            }
                        }
                        if (!in_room){
                            this.agent.beliefs.declare('is_empty '+ r.name);
                        }
                    }
                }
            });

            m_goal.push(presenceGoalPromise);
        }
        yield Promise.all(m_goal);
    }
}

module.exports = {SensorPresenceGoal, SensorPresenceIntention};
