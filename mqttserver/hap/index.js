const hap = require("hap-nodejs");
const accessoryBuilder = require('./accessoryBuilder');

module.exports = async app => {
    const coffee1 = {
        controller: app.controllers.coffee,
        name: 'Coffee Pot',
        port: 47130,
        category: hap.Categories.OUTLET,
        enableMethod: app.controllers.coffee.agitateWater.bind(app.controllers.coffee),
        macAddress: '2A-51-2A-EB-C6-D1'
    };
    const coffee2 = Object.assign({}, coffee1, {
        port: 47132,
        macAddress: '2A-51-2A-EB-C6-D2'
    })
    const lamp1 = {
        controller: app.controllers.lamp,
        name: 'Lamp',
        port: 47129,
        category: hap.Categories.LIGHTBULB,
        macAddress: '8C-92-75-40-2D-2E'
    };
    const lamp2 = Object.assign({}, lamp1, {
        port: 47131,
        macAddress: '8C-92-75-40-2D-2D'
    })
    // due to apple gating having multiple people per home behind a device, this is my workaround
    // double the accessory count, share the controller -> shared state
    await accessoryBuilder(coffee1);
    await accessoryBuilder(coffee2);
    await accessoryBuilder(lamp1);
    await accessoryBuilder(lamp2);
}