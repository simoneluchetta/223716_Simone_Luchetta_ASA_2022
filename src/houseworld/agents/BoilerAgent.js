const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');

class BoilersGoal extends Goal{
    constructor(boilers, solarpanel){
        super();
        this.boilers = boilers;
        this.solarpanel = solarpanel;
    }
}

class BoilersIntention extends Intention{
    constructor(agent, goal){
        super(agent,goal);
        this.boilers = this.goal.boilers;
        this.solarpanel = this.goal.solarpanel;
    }
    static applicable (goal){
        return goal instanceof BoilersGoal;
    }
    *exec(){
        var m_goal = [];
        for(let b of this.boilers){
            let boilerGoalPromise = new Promise( async res => {
                while (true) {
                    // Define boiler strategy:
                    let status = await this.agent.beliefs.notifyChange('status');

                    if(b.temperature <= 70){
                        console.log("Current temp is: " + b.temperature);
                        this.agent.beliefs.declare('status', true);
                        // If there is energy available:
                        if(this.goal.solarpanel.getEnergy() != 0){
                            this.agent.beliefs.declare('energy');
                            this.agent.beliefs.undeclare('gas');
                            b.warmingEnergy();
                        }

                        // Warm up with natural gas instead:
                        else{
                            this.agent.beliefs.declare('gas');
                            this.agent.beliefs.undeclare('energy');
                            b.warmingMethane();
                        }
                    }

                    else{
                        console.log("Current temp is: " + b.temperature);
                        this.agent.beliefs.declare('status', false);
                        b.warmingOff();
                    }
                }
            });

            m_goal.push(boilerGoalPromise);
        }
        yield Promise.all(m_goal);
    }
}

module.exports = {BoilersGoal, BoilersIntention};
