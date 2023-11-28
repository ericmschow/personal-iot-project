const hap = require("hap-nodejs");
const accessoryBuilder = require('./accessoryBuilder');

module.exports = (app) => accessoryBuilder({
    controller: app.controllers.lamp,
    name: 'Lamp',
    category: hap.Categories.LIGHTBULB,
    macAddress: '8C-92-75-40-2D-2E'
})