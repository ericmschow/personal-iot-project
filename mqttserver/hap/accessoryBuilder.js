const hap = require("hap-nodejs");

const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

module.exports = ({
  category,
  name,
  controller,
  macAddress,
  pincode = process.env.PINCODE,
  port = 47129,
  queryMethod = controller.queryState.bind(controller),
  enableMethod = controller.setOn.bind(controller),
  disableMethod = controller.setOff.bind(controller)
}) => {
  // optionally set a different storage location with code below
  // hap.HAPStorage.setCustomStoragePath("...");

  if (!pincode) throw new Error('PINCODE must be set in env');

  const accessoryUuid = hap.uuid.generate(name);
  const accessory = new Accessory(name, accessoryUuid);

  const service = new Service.Outlet(name);

  // 'On' characteristic is required for the light service
  const onCharacteristic = service.getCharacteristic(Characteristic.On);

  // with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
  onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    try {
      return queryMethod().then((currentLightState) => {
        console.log("Queried current light state: " + currentLightState);
        callback(undefined, currentLightState);
      });
    }
    catch (e) {
      console.error('Error querying light state', e);
      callback(e)
    }
  });
  onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    try {
      console.log("Setting light state to: " + value);
      const method = ((!!value) ? enableMethod : disableMethod);
      return method().then((currentLightState) => {
        console.log("Queried current light state: " + currentLightState);
        callback();
      });
    }
    catch (e) {
      console.error('Error setting light state', e);
      callback(e)
    }
  });


  accessory.addService(service); // adding the service to the accessory

  // once everything is set up, we publish the accessory. Publish should always be the last step!
  accessory.publish({
    username: macAddress,
    pincode,
    port,
    category, // value here defines the symbol shown in the pairing screen
  });

  console.log(name, "Accessory setup finished!");
}
