const mongoose = require('mongoose');
const schema = require('./schema');

const Users = mongoose.model('User', schema.userSchema);

async function getUsers() {
    return Users.find();
}

async function createUser(user) {
    return Users.create(user);
}

async function updateUser(id, user) {
    return Users.findByIdAndUpdate(id, user, { new: true });
}

async function deleteUser(id) {
    return Users.findByIdAndDelete(id);
}

async function findByName(name) {
    return Users.find({ name: name });
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    findByName
}