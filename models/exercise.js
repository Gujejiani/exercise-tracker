const mongoose = require('mongoose');
const ExerciseSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    description: String,
    duration: Number,
    date: Date,
}, {
    versionKey: false
});
// UserSchema.virtual('count').get(function () {
//     console.log('am running')
//     return this.logs.length;
// });
const Exercise = mongoose.model('exercise', ExerciseSchema);

module.exports = Exercise;