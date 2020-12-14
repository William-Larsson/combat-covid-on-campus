const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    value: {
        type: Number,
        default: 0,
        min: 0,
        required: false,
    }
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;