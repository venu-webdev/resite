const mongoose = require('mongoose')

const userModelOptions = {
    type: String,
    required: true
}

const UserSchema = mongoose.Schema({
    username: userModelOptions,
    email: { type: String, required: true, unique: true },
    password: userModelOptions,
    role: userModelOptions
})

const userModel = mongoose.model('user', UserSchema)
console.log("created userModel...")

module.exports = {
    userModel
}