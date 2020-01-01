const Promise = require('bluebird');
const AbstractController = require('./AbstractController');

module.exports = class LampController extends AbstractController {
  constructor(app) {
    super(app);
    this.topic = 'lamp';
  }

  async blink() {
    await this.toggleOnce();
    await Promise.delay(1000);
    await this.toggleOnce();
  }
}
