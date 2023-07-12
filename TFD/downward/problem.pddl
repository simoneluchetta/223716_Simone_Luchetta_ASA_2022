;; problem file: problem-vacuum1.pddl
(define (problem vacuum_problem)
    (:domain vacuum)
	
    (:objects 
		vacuum - robot
		base_station - base
		closet - room
		service_bathroom - room
		open_space - room
		walkin_closet - room
		disengagement - room
		child_bedroom - room
		master_bedroom - room
		main_bathroom - room
		b0 - battery
		b1 - battery
		b2 - battery
		b3 - battery
		b4 - battery
    )

	(:init 
		(is_placed base_station closet)
		(adjacent service_bathroom open_space)
		(adjacent open_space service_bathroom)
		(adjacent walkin_closet disengagement)
		(adjacent disengagement walkin_closet)
		(adjacent child_bedroom disengagement)
		(adjacent disengagement child_bedroom)
		(adjacent master_bedroom disengagement)
		(adjacent disengagement master_bedroom)
		(adjacent main_bathroom disengagement)
		(adjacent disengagement main_bathroom)
		(adjacent closet disengagement)
		(adjacent disengagement closet)
		(battery_follow b0 b1)
		(battery_follow b1 b2)
		(battery_follow b2 b3)
		(battery_follow b3 b4)
		(is_dirty child_bedroom)
		(is_dirty master_bedroom)
		(is_dirty main_bathroom)
		(is_clean open_space)
		(is_clean disengagement)
		(is_clean service_bathroom)
		(is_clean walkin_closet)
		(battery_lev vacuum b2)
		(in_room vacuum child_bedroom)
		(free vacuum)		
	)

	(:goal 
		(and 
			(is_clean child_bedroom)
			(is_clean master_bedroom)
			(is_clean walkin_closet)
			(is_clean main_bathroom)
			(is_clean disengagement)
		)
	)
)
