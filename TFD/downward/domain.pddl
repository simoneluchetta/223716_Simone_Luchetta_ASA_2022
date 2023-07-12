;; domain file: domain-vacuum1.pddl
(define (domain vacuum)
    (:requirements :strips :typing :durative-actions)
    (:types
        robot
        room 
        base 
        battery
    )
    (:predicates
        (in_room ?v - robot ?r1 - room)
        (adjacent ?r1 - room ?r2 - room)
        (is_dirty ?r - room)
        (battery_lev ?v - robot ?b2 - battery)
        (battery_follow ?b1 - battery ?b2 - battery)
        (is_clean ?r - room)
        (is_placed ?bs - base ?r - room)
        (free ?v - robot)
        (moving ?v - robot)
        (cleaning ?v - robot)
        (charging ?v - robot)              
    )
    (:durative-action Move
        :parameters (?v ?r1 ?r2)
        :duration (= ?duration 1)
        :condition (and 
            (at start (and 
                (in_room ?v ?r1)
                (free ?v)
            ))
            (over all (and 
                (adjacent ?r1 ?r2)
            ))
        )
        :effect (and 
            (at start (and 
                (not (free ?v))
                (moving ?v)
            ))
            (at end (and 
                (not (in_room ?r1))
                (in_room ?r2)
                (not (moving ?v))
                (free ?v)
            ))
        )
    )

    (:durative-action Clean
        :parameters (?v ?r ?b1 ?b2)
        :duration (= ?duration 3)
        :condition (and 
            (at start (and
                (is_dirty ?r)
                (battery_lev ?v ?b2)
                (free ?v)
            ))
            (over all (and
                (in_room ?r)
                (battery_follow ?b1 ?b2) 
            ))
        )
        :effect (and 
            (at start (and 
                (not (battery_lev ?v ?b2))
                (not (free ?v))
                (cleaning ?v)
            ))
            (at end (and 
                (battery_lev ?v ?b1)
                (not (is_dirty ?r))
                (is_clean ?r)
                (not (cleaning ?v))
                (free ?v)
            ))
        )
    )

    (:durative-action Charge
        :parameters (?v ?r ?b1 ?b2 ?bs)
        :duration (= ?duration 2)
        :condition (and 
            (at start (and 
                (battery_lev ?v ?b1)
                (free ?v)
            ))
            (over all (and 
                (in_room ?r)
                (battery_follow ?b1 ?b2)
                (is_placed ?bs ?r)
            ))
        )
        :effect (and 
            (at start (and 
                (not (battery_lev ?v ?b1))
                (not (free ?v))
                (charging ?v)
                
            ))
            (at end (and 
                (battery_lev ?v ?b2)
                (not (charging ?v))
                (free ?v)
            ))
        )
    )
)