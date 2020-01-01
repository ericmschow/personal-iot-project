const Promise = require('bluebird');
const AbstractController = require('./AbstractController');

module.exports = class CoffeeController extends AbstractController {
  constructor(app) {
    super(app);
    this.topic = 'coffee';
    this.millisecondsToStayEngaged = 1000 * 60 * 5; // 5 minutes
  }

  async agitateWater() {
    await this.setOn();
    await Promise.delay(this.millisecondsToStayEngaged);
    await this.setOff();
  }
}
