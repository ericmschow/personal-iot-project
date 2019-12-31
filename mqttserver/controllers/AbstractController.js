module.exports = new class AbstractController {

    constructor(app) {
      this.app = app;
    }

    toggleOnce(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'TOGGLE');
    }

    setOn(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'ON');
    }

    setOff(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.app.mqttHandler.publishMessage(this.topic, 'Power', 'OFF');
    }
}
