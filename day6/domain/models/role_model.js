const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    stacks: {
        type: [String],
        required: false
    }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;