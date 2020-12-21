const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    floor: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
    },
    LAT: {
        type: Number,
        required: [true, 'Latitude is required'],
    },
    LONG: {
        type: Number,
        required: [true, 'Longitude is required'],
    },
    heatValue: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Sensor = mongoose.model('Sensor', SensorSchema);
module.exports = Sensor;