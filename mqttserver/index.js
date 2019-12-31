const MqttHandler = require('./mqtt-handler');
const Promise = require('bluebird');

let mqttHandler;
(() => {
  async function start() {
    try {
      let mqttHandler = new MqttHandler();
      await mqttHandler.initialize();
      await mqttHandler.publishMessage('lamp', 'Power', 'TOGGLE');
      await Promise.delay(5000)
      await mqttHandler.publishMessage('lamp', 'Power', 'TOGGLE');
      console.log('tearing down');
      await mqttHandler.teardown();
    }
    catch (e) {
      console.error(e);
      if (mqttHandler) {
        await mqttHandler.teardown();
      }
    }
  };
  console.log('starting');
  start();
})();
