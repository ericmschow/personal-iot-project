const coffeeAccessory = require('./coffeeAccessoryBuilder');
const lampAccessory = require('./lampAccessoryBuilder');

module.exports = async app => {
    await coffeeAccessory(app);
    await lampAccessory(app);
}