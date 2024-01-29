const mongoose = require('mongoose');
const ExerciseSchema =  require('./exercise')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    description: String,
    duration: Number,
    date: String,
    count: Number
}, {
    versionKey: false
});
// UserSchema.virtual('count').get(function () {
//     console.log('am running')
//     return this.logs.length;
// });
const User = mongoose.model('usersNew', UserSchema);

module.exports = User;