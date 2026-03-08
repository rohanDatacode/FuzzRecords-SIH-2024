const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'officer', 'viewer'],
        default: 'viewer'
    },
    badgeNumber: String,
    fullName: String
});

// Fix: Some versions require this specific check
const plugin = (typeof passportLocalMongoose === 'function') 
               ? passportLocalMongoose 
               : passportLocalMongoose.default;

userSchema.plugin(plugin);

module.exports = mongoose.model('User', userSchema);