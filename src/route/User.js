const route = require("express").Router();
const userControllers = require("../controllers/userControllers");


route.put('/:id', userControllers.updateUser);
route.delete('/:id', userControllers.deleteUser);
route.get('/', userControllers.getAllUser);
module.exports = route;
