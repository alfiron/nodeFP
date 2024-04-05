const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sportType: { type: String, required: true },
    difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    duration: { type: Number, required: true }, 
    exercises: [{ type: String }], 
    trainerNotes: { type: String },
    isCancelled: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;