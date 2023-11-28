const Promise = require('bluebird');

module.exports = class AbstractController {
    constructor(mqttHandler) {
      if (!mqttHandler) {
        throw new Error('Controller called without app')
      }
      this.mqttHandler = mqttHandler;
      this.lastMessage = null;

      this.state = false;
    }

    async queryState() {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.mqttHandler.publishMessage(this.topic, 'Power'); // causes handleMessage to update state
      await Promise.delay(20);
      return this.state;
    }

    async toggleOnce(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.mqttHandler.publishMessage(this.topic, 'Power', 'TOGGLE');
    }

    async setOn(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.mqttHandler.publishMessage(this.topic, 'Power', 'ON');
    }

    async setOff(req, res) {
      if (!this.topic) {
        throw new Error('Topic not set');
      }
      await this.mqttHandler.publishMessage(this.topic, 'Power', 'OFF');
    }
}
