const hapServer = require('./hap');
const mqttHandler = require('./mqtt')
const httpServer = require('./http');

(async () => {
    const mqtt = new mqttHandler();
    await mqtt.initialize();

    await httpServer(mqtt);
    await hapServer(mqtt);
})();
