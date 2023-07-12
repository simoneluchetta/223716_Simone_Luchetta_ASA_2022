# Project_ASA_2022
## Luchetta Simone
The goal of this project is to simulate the behavior of a hypothetical smart home.
The proposed scenario envisages the presence of two residents inside the home, who can roam the two floors of the building, using the goods and services arranged in the appropriate rooms.

There is a main house agent (HouseAgent) who knows everything that happens inside the dwelling. Thanks to this, it is possible to inform the agent responsible for the control of the lights (namely the LightsAgent).

To track the consumption of resources and carry on the automatic switching of operations, there is agent in control of the boiler (BoilerAgent), which manages water heating operations according to user needs.

As regards watering the plants inside the home, two supervisory agents monitor their status and take care of their due maintenance, and they are the solely planning agents (sprinkleR1 and sprinkleR2).

## Requirements

Javascript, Node.

## Run

Install the module by using this command while being in the main folder:
```
npm install
```

To execute the program:
```
node ./src/houseworld/HouseWorld.js
```

Once executed, PDDL domain and problem files are available within the ./test folder.

## ASA_assignment_3

### Domain
The domain contains all descriptors for the planning robots, and is auto-generated when executing the code. Ad-hoc predicates allow each agent to fullfill its goals.

```
;; domain file: domain-robot1.pddl
(define (domain robot1)
    (:requirements :strips)
    (:predicates
        (is_in_current ?robot ?room1)
        (is_adjacent ?room1 ?room2)
        (is_in_charge_point ?charge_point ?robot)
        (needs_water ?room)
        (chargePoint_in_room ?charge_point ?room)              
    )
    
        (:action Move
            :parameters (?robot ?room1 ?room2 ?charge_point)
            :precondition (and
                (is_in_current ?robot ?room1)
                (is_adjacent ?room1 ?room2)
            )
            :effect (and
                (not (is_in_current ?robot ?room1))
                (is_in_current ?robot ?room2)
                (not (is_in_charge_point ?charge_point ?robot))
            )
        )
        
        (:action Sprinkle
            :parameters (?room ?robot)
            :precondition (and
                (is_in_current ?robot ?room)
                (needs_water ?room)
            )
            :effect (and
                (not (needs_water ?room))
            )
        )
        
        (:action Recharge
            :parameters (?robot ?charge_point ?room)
            :precondition (and
                (is_in_current ?robot ?room)
                (chargePoint_in_room ?charge_point ?room)
                (not (is_in_charge_point ?charge_point ?robot))
            )
            :effect (and
                (is_in_charge_point ?charge_point ?robot)
            )
        )
)
```

### Problem
The problem file contains everything needed by the agents in order to find an plan for their task. An example of how the information is encoded is presented hereinafter:

```
;; problem file: problem-robot1.pddl
(define (problem robot1)
    (:domain robot1)
    (:objects 
    lobby 
    stairs 
    groundLiving 
    kitchen 
    laundry 
    groundBathroom 
    masterBedroom 
    privateBathroom 
    drawer 
    smallBedroom 
    firstLiving 
    charge_point2 
    charge_point1 
    robot2 
    robot1)

	(:init 
    ;; Rooms adjacency information:
    (is_adjacent lobby stairs) 
    (is_adjacent lobby groundLiving) 
    (is_adjacent stairs lobby) 
    (is_adjacent stairs kitchen) 
    (is_adjacent groundLiving lobby) 
    (is_adjacent groundLiving kitchen) 
    (is_adjacent kitchen groundLiving) 
    (is_adjacent kitchen stairs) 
    (is_adjacent kitchen laundry) 
    (is_adjacent laundry groundBathroom) 
    (is_adjacent laundry kitchen) 
    (is_adjacent groundBathroom laundry) 
    (is_adjacent masterBedroom privateBathroom) 
    (is_adjacent masterBedroom drawer) 
    (is_adjacent smallBedroom firstLiving) 
    (is_adjacent privateBathroom drawer) 
    (is_adjacent privateBathroom masterBedroom) 
    (is_adjacent firstLiving smallBedroom) 
    (is_adjacent firstLiving drawer) 
    (is_adjacent drawer masterBedroom) 
    (is_adjacent drawer firstLiving) 
    (is_adjacent drawer privateBathroom) 

    ;; Robots' charging point spawn:
    (chargePoint_in_room charge_point2 firstLiving) 
    (chargePoint_in_room charge_point1 lobby) 

    ;; Robots' current information:
    (is_in_current robot2 firstLiving) 
    (is_in_current robot1 lobby) 
    (is_in_charge_point charge_point2 robot2) 
    (is_in_charge_point charge_point1 robot1) 

    ;; Robots' tasks:
    (needs_water lobby) 
    (needs_water stairs) 
    (needs_water groundLiving) 
    (needs_water kitchen) 
    (needs_water laundry) 
    (needs_water groundBathroom) 
    (needs_water masterBedroom) 
    (needs_water smallBedroom) 
    (needs_water privateBathroom) 
    (needs_water firstLiving) 
    (needs_water drawer))

	(:goal 
    (and (not (needs_water lobby)) 
    (not (needs_water stairs)) 
    (not (needs_water groundLiving)) 
    (not (needs_water kitchen)) 
    (not (needs_water laundry)) 
    (is_in_charge_point charge_point1 robot1)))
)
```