const Workout = require('../models/Workout');

exports.createWorkout = async (req, res) => {
    try {
        const { title, description, sportType, difficultyLevel, duration, exercises, trainerNotes, isCancelled, rating } = req.body;
        const createdBy = req.user._id; 

        const workout = new Workout({
            title,
            description,
            createdBy, 
            sportType,
            difficultyLevel,
            duration,
            exercises,
            trainerNotes,
            isCancelled,
            rating
        });

        await workout.save();
        res.status(201).send('Тренировка успешно создана.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера при создании тренировки.');
    }
};

exports.getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.status(200).json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении тренировок' });
    }
};

