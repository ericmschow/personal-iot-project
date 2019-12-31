const MqttHandler = require('./MqttHandler');
const Promise = require('bluebird');

const express = require('express')
const app = express()
const port = process.env.MQTTSERVER_LISTENING_PORT;

const mqttHandler = new MqttHandler();
app.mqttHandler = await mqttHandler.initialize();

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// let mqttHandler;
// (() => {
//   async function start() {
//     try {
//       await mqttHandler.publishMessage('lamp', 'Power', 'TOGGLE');
//       await Promise.delay(5000)
//       await mqttHandler.publishMessage('lamp', 'Power', 'TOGGLE');
//       console.log('tearing down');
//       await mqttHandler.teardown();
//     }
//     catch (e) {
//       console.error(e);
//       if (mqttHandler) {
//         await mqttHandler.teardown();
//       }
//     }
//   };
//   console.log('starting');
//   start();
// })();
