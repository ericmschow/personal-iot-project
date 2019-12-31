const MqttHandler = require('./mqtt-handler');

let mqttHandler;

try {

  let mqttHandler = new MqttHandler();

  mqttHandler.publish('lamp', 'Power TOGGLE');

  mqttHandler.teardown();

}

catch (e) {
  console.error(e);
  if (mqttHandler) {
    mqttHandler.teardown();
  }
}
