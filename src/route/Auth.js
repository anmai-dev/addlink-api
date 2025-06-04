const route = require('express').Router();
const authControllers = require('../controllers/authControllers')



route.post('/register', authControllers.register)
route.post('/login', authControllers.login)

module.exports = route
