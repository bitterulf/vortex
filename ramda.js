var ee = require('event-emitter');
var R = require('ramda');

var emitter = ee({});

var data = {
    vehicles: []
};

const reducer = function(state, action, payload) {
    const applyVehicleDefaults = R.merge({color: 'grey'});

    const addNewVehicle = function(payload) {
        return R.insert(state.vehicles.length, applyVehicleDefaults(payload), state.vehicles);
    };

    const removeVehicleByFilter = R.filter(R.__, state.vehicles);

    const updateVehicles = R.assoc('vehicles', R.__, state);

    const filterVehiclesWithPayloadId = function(v) {
        return !R.eqProps('id', v, payload);
    };

    const getVehicleById = function(id) {
        return R.find(R.propEq('id', id), state.vehicles);
    };

    const setError = R.assoc('error', R.__, state);

    switch(action) {
        case 'addVehicle':
            return updateVehicles(
                addNewVehicle(payload)
            );
        case 'removeVehicle':
            if (!getVehicleById(payload.id)) return setError('something wrong here');

            return updateVehicles(
                removeVehicleByFilter(
                    filterVehiclesWithPayloadId
                )
            );
        default:
            return state;
    }
}

const transformer = function(state) {
    const groupVehiclesByColor = function(v) {return v.color};

    const calculateVehicleColors = function(state) {
        return R.countBy(groupVehiclesByColor)(state.vehicles);
    };

    const generateHTML = function(state) {
        return R.join(
            ' ',
            R.map(function(v) { return '<div>'+v.id+'</div>'; }, state.vehicles)
        );
    };

    return R.merge(state, {
        vehicleColors: calculateVehicleColors(state),
        html: generateHTML(state)
    });
};

emitter.on('dispatch', listener = function (action, payload) {
    data = reducer(data, action, payload);
    console.log(data);
    console.log(transformer(data));
});

emitter.emit('dispatch', 'addVehicle', {id: 'id1', color: 'red'});
emitter.emit('dispatch', 'addVehicle', {id: 'id2', color: 'blue'});
emitter.emit('dispatch', 'addVehicle', {id: 'id3', color: 'red'});
emitter.emit('dispatch', 'addVehicle', {id: 'id4', color: 'blue'});
emitter.emit('dispatch', 'addVehicle', {id: 'id5'});
emitter.emit('dispatch', 'removeVehicle', {id: 'id1'});
emitter.emit('dispatch', 'removeVehicle', {id: 'id1'});
