module.exports = class AbstractController {

    constructor(app) {
      if (!app) {
        throw new Error('Controller called without app')
      }
      this.app = app;
    }

    async toggleOnce(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'TOGGLE');
    }

    async setOn(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'ON');
    }

    async setOff(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'OFF');
    }
}
