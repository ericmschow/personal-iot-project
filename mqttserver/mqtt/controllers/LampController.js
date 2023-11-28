const Promise = require('bluebird');
const AbstractController = require('./AbstractController');

module.exports = class LampController extends AbstractController {
  constructor(mqttHandler) {
    super(mqttHandler);
    this.topic = 'lamp';
  }

  async blink() {
    await this.toggleOnce();
    await Promise.delay(1000);
    await this.toggleOnce();
  }
}
