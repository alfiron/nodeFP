const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const connectDB = require('./config/db');

dotenv.config();

connectDB();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Workout Manager!');
});

app.get('/auth/login', (req, res) => {
    res.render('auth/login', { title: 'Login', body: 'Login Page Content' });
});

app.get('/auth/register', (req, res) => {
    res.render('auth/register', { title: 'Register', body: 'Register Page Content' });
});

app.get('/workouts/create', (req, res) => {
    const users = [
        { id: 'userId1', name: 'User 1' },
        { id: 'userId2', name: 'User 2' },
    ];

    res.render('workouts/createWorkout', { title: 'Create Workout', users });
});

app.get('/workouts/view', (req, res) => {
   
    const workouts = [
        { title: 'Workout 1', description: 'Description 1', sportType: 'Sport 1', difficultyLevel: 'Beginner', duration: 60, exercises: ['Exercise 1', 'Exercise 2'], trainerNotes: 'Notes 1', isCancelled: false, rating: 4 },
        { title: 'Workout 2', description: 'Description 2', sportType: 'Sport 2', difficultyLevel: 'Intermediate', duration: 45, exercises: ['Exercise 3', 'Exercise 4'], trainerNotes: 'Notes 2', isCancelled: true, rating: 3 }
    ];

    res.render('workouts/viewWorkouts', { title: 'View Workouts', workouts });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
