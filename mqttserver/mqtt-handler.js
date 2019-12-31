const topics = {
  lamp: true,
  coffee: true
}

const mqtt = require('mqtt');
const url = process.env.MQTT_ADDRESS;
const user = process.env.MQTT_USER;
const passwd = process.env.MQTT_PASSWD;

module.exports = class MqttHandler {
  constructor() {

    if (!(url && user && passwd)) {
      throw new Error('failed to import env vars')
    }

    let options = {
      username: user,
      password: passwd
    }
    this.client = mqtt.connect(url,options)
    this.client.on("error", err => {
      // 'error' event is only on connection errors
      console.error('cannot connect');
      throw err;
    });
  }
  teardown() {
    if (this.client) {
      this.client.end();
    }
  }
  subscribeToTopics() {
    if (this.client) {
      for (let topic in topics) {
        this.client.subscribe(topic, err => {
          if (err) {
            console.error('subscription error, topic: ' + topic)
            throw err;
          }
        });
      }
    }
  }
  publishMessage(topic, message) {
    if (!topics[topic]) {
      throw new Error(`Invalid topic: ${topic}`);
    }
    this.client.publish(topic, message);
  }
}
