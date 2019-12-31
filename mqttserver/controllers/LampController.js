const Promise = require('bluebird');
const AbstractController = require('./AbstractController');

module.exports = new class LampController extends AbstractController {
  constructor(app) {
    this.app = app;
    this.topic = 'lamp';
  }

  blink() {
    await this.toggleOnce();
    await Promise.delay(1000);
    await this.toggleOnce();
  }

}
