const hap = require("hap-nodejs");
const accessoryBuilder = require('./accessoryBuilder');

module.exports = (app) => accessoryBuilder({
    controller: app.controllers.coffee,
    name: 'Coffee Pot',
    port: 47130,
    category: hap.Categories.OUTLET,
    enableMethod: app.controllers.coffee.agitateWater.bind(app.controllers.coffee),
    macAddress: '2A-51-2A-EB-C6-D1'
})