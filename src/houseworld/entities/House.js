const LightSystem = require('./LightSystem');
const Boiler = require('./Boiler');
const Person = require('./Person');
const Room = require('./Room');
const TemperatureRegulator = require('./TemperatureRegulator');
const SolarPanel = require('./SolarPanel');
const Utilities = require('./Utilities')

class House{
    constructor(){
        this.total_consumption = 0;
        this.people = {
            marianna: new Person(this, 'Marianna', 'masterBedroom'),
            simone: new Person(this, 'Simone', 'kitchen')
        };

        // 500W --> much the house consumes every day in power for heating:
        this.utilities = new Utilities(this, 500);

        this.solarpanel = new SolarPanel(this);
        // Maybe one could also add this.photovoltaicpanel = new PhotovoltaicPanel(this);
        // But the principle of operation is the same as the SolarPanel...
        
        this.lights = {
        // Create a light system for each room in the house:
        // Each light is referred to an house (this), a 'room' and consumes X watts:
        // l_lightInRoom: new LightSystem(this, 'lightInRoom', X)
            /* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
            */
            l_lobby: new LightSystem(this, 'lobby', 10),
            l_stairs: new LightSystem(this, 'stairs', 10),
            l_groundLiving: new LightSystem(this, 'groundLiving', 40),
            l_kitchen: new LightSystem(this, 'kitchen', 30),
            l_laundry: new LightSystem(this, 'laundry', 10),
            l_groundBathroom: new LightSystem(this, 'groundBathroom', 10),

            /* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
            */
            l_masterBedroom: new LightSystem(this, 'masterBedroom', 20),
            l_smallBedroom: new LightSystem(this, 'smallBedroom', 20),
            l_privateBathroom: new LightSystem(this, 'privateBathroom', 10),
            l_firstLiving: new LightSystem(this, 'firstLiving', 50),
            l_drawer: new LightSystem(this, 'drawer', 20)
        };

        this.boilers = {
            b_laundry: new Boiler(this, 'laundry'),
            b_kitchen: new Boiler(this, 'kitchen')
        };

        this.thermostats = {
           t_lobby: new TemperatureRegulator(this),
           t_stairs: new TemperatureRegulator(this),
           t_groundLiving: new TemperatureRegulator(this),
           t_kitchen: new TemperatureRegulator(this),
           t_laundry: new TemperatureRegulator(this),
           t_groundBathroom: new TemperatureRegulator(this),

           t_masterBedroom: new TemperatureRegulator(this),
           t_smallBedroom: new TemperatureRegulator(this),
           t_privateBathroom: new TemperatureRegulator(this),
           t_firstLiving: new TemperatureRegulator(this),
           t_drawer: new TemperatureRegulator(this)
        };

        this.rooms = {
            /* GROUND FLOOR (6):
            lobby
            stairs
            groundLiving
            kitchen
            laundry
            groundBathroom
            */
           lobby: new Room(this, 'lobby', this.lights.l_lobby, this.thermostats.t_lobby, 'ground', 20, ['stairs', 'groundLiving']),
           stairs: new Room(this, 'stairs', this.lights.l_stairs, this.thermostats.t_stairs, 'ground', 10, ['lobby', 'kitchen'], this.boilers.b_kitchen),
           groundLiving: new Room(this, 'groundLiving', this.lights.l_groundLiving, this.thermostats.t_groundLiving, 'ground', 30, ['lobby', 'kitchen']),
           kitchen: new Room(this, 'kitchen', this.lights.l_kitchen, this.thermostats.t_kitchen, 'ground', 20, ['stairs', 'groundLiving', 'laundry']),
           laundry: new Room(this, 'laundry', this.lights.l_laundry, this.thermostats.t_laundry, 'ground', 10, ['kitchen', 'groundBathroom'], this.boilers.b_laundry),
           groundBathroom: new Room(this, 'groundBathroom', this.lights.l_groundBathroom, this.thermostats.t_groundBathroom, 'ground', 1, ['laundry']),

            /* FIRST FLOOR (5):
            masterBedroom
            smallBedroom
            privateBathroom
            firstLiving
            drawer
            */
            masterBedroom: new Room(this, 'masterBedroom', this.lights.l_masterBedroom, this.thermostats.t_masterBedroom, 'first', 10, ['privateBathroom', 'drawer']),
            smallBedroom: new Room(this, 'smallBedroom', this.lights.l_smallBedroom, this.thermostats.t_smallBedroom, 'first', 10, ['firstLiving']),
            privateBathroom: new Room(this, 'privateBathroom', this.lights.l_privateBathroom, this.thermostats.t_privateBathroom, 'first', 10, ['masterBedroom', 'drawer']),
            firstLiving: new Room(this, 'firstLiving', this.lights.l_firstLiving, this.thermostats.t_firstLiving, 'first', 40, ['drawer', 'smallBedroom']),
            drawer: new Room(this, 'drawer', this.lights.l_drawer, this.thermostats.t_drawer, 'first', 10, ['firstLiving', 'privateBathroom', 'masterBedroom'])
        };
    }
}

module.exports = House;
