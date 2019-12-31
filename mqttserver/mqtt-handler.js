const topics = {
  lamp: true,
  coffee: true
}

const mqtt = require('async-mqtt');
const url = process.env.MQTT_ADDRESS;
const user = process.env.MQTT_USER;
const passwd64 = process.env.MQTT_PASSWD;

module.exports = class MqttHandler {
  constructor() {

    if (!(url && user && passwd64)) {
      throw new Error('failed to import env vars');
    }

    this.url = url;
    this.options = {
      username: user,
      password: Buffer.from(passwd64, 'base64').toString('utf-8'),
      clientId: 'piMqttServer'
    }
    this.client = null;
  }
  async initialize() {
    try {
      if (!this.client) {
        console.log('connecting', this.url);
        this.client = await mqtt.connectAsync(this.url, this.options);
        console.log('subscribing');
        await this.subscribeToTopics();
        console.log('registering handler');
        this.client.on('message', this.handleMessage);
      }
    }
    catch (e) {
      console.log('initialize error');
      throw e;
    }
  }

  handleMessage(topic, message) {
    console.log('new message', topic, message.toString());
  }

  async teardown() {
    if (this.client) {
      await this.client.end();
    }
  }

  async subscribeToTopics() {
    if (this.client) {
      for (let topic in topics) {
        console.log('subscribing to', topic);
        await this.client.subscribe(topic);
      }
    }
  }
  async publishMessage(topic, command, message) {
    if (!topics[topic]) {
      throw new Error(`Invalid topic: ${topic}`);
    }
    let fullTopic = 'cmnd/' + topic + '/' + command;
    console.log('publishing', fullTopic, message);
    await this.client.publish(fullTopic, message);
  }
}
