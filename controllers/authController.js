const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');

exports.register = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('trainer', 'athlete').required()
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).send('Пользователь с таким email уже существует.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            verified: false
        });
        await user.save();

        res.status(201).send('Пользователь успешно зарегистрирован.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера при регистрации пользователя.');
    }
};

exports.login = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Неправильный email или пароль.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Неправильный email или пароль.');

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера при входе пользователя.');
    }
};
