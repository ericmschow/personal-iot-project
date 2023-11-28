
const express = require('express')

const fs = require('fs');
const path = require('path');
const app = express()
app.use('/public', express.static(path.join(__dirname, 'public')));
const port = process.env.MQTTSERVER_LISTENING_PORT || 2112;

app.log = function() {
  // in case I ever need this thing logging somewhere
  let msg = [...arguments].join(' ');
  console.log(msg);
};

module.exports = (mqttHandler) => {
  async function start() {
    try {
      app.mqttHandler = mqttHandler;
      const coffeePage = fs.readFileSync(path.join(__dirname, 'pages/coffee.html')).toString(); // todo in future, using a router

      // todo if more devices purchased: make loader that iterates over files in folder

      const turnOnCoffee = async (req, res, next) => {
        try {
          res.send('<h1>Agitation request received</h1>'); // ack first because method exceeds browser timeout
          await (app.mqttHandler.controllers.coffee.agitateWater());
        }
        catch (err) {
          app.log('coffeeOn error', err);
          res.status(500);
          next(err);
        }
      }
      const turnOffCoffee = async (req, res, next) => {
        try {
          await (app.mqttHandler.controllers.coffee.setOff());
          res.send('<h1>Depowered coffee agitator manually.</h1>');
        }
        catch (err) {
          app.log('coffeeOff error', err);
          res.status(500);
          next(err);
        }
      };

      app.get('/coffeeOff', turnOffCoffee);
      app.post('/coffeeOff', turnOffCoffee);
      app.post('/coffeeOn', turnOnCoffee); 
      app.get('/coffee', turnOnCoffee);


      app.get('/coffeeMenu', async (req, res) => {
        try {
          res.send(coffeePage);
        }
        catch(err) {
          app.log('coffee GET error', err);
          res.status(500);
        }
      })


      app.get('/lamp', async (req, res) => {
        try {
          await (app.mqttHandler.controllers.lamp.toggleOnce());
          res.send('<h1>Lamp toggled.</h1>');
        }
        catch (err) {
          app.log('lamp error', err);
          res.status(500);
        }
      })

      app.get('/', function (req, res) {
        res.send('<h1>GET request to homepage</h1>')
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
}
