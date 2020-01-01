
const Promise = require('bluebird');
const express = require('express')

const MqttHandler = require('./MqttHandler');
const CoffeeController = require('./controllers/CoffeeController');
const LampController = require('./controllers/LampController');

const app = express()
const port = process.env.MQTTSERVER_LISTENING_PORT;

app.log = function() {
  // in case I ever need this thing logging somewhere
  let msg = [...arguments].join(' ');
  console.log(msg);
};

(() => {
  async function start() {
    try {
      app.mqttHandler = new MqttHandler();
      await app.mqttHandler.initialize();

      app.controllers = {
        coffee: new CoffeeController(app),
        lamp: new LampController(app)
      };

      app.get('/coffee', async (req, res) => {
        try {
          res.send('Agitation request received');
          await (app.controllers.coffee.agitateWater());
          res.send('Agitation complete if you\'re still listening.');
        }
        catch (err) {
          app.log('coffee error', err);
          res.status(500);
        }
      })

      app.get('/lamp', async (req, res) => {
        try {
          await (app.controllers.lamp.toggleOnce());
          res.send('Lamp toggled.');
        }
        catch (err) {
          app.log('lamp error', err);
          res.status(500);
        }
      })

      app.get('/', function (req, res) {
        res.send('GET request to homepage')
      })

      app.listen(port, () => console.log(`IOT Server listening on port ${port}!`))
    }
    catch (err) {
      console.error(err);
      if (app.mqttHandler) await app.mqttHandler.teardown();
      process.exit(1);
    }
  }
  start();
})()
