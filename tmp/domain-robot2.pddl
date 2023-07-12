;; domain file: domain-robot2.pddl
(define (domain robot2)
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