echo 'Destination IP (MQTT_PI_IP): '$MQTT_PI_IP
echo 'Does this look correct? [y/N]?'
read choice
if [ "$choice" != "y" ]; then
    exit
fi
echo 'Archiving...'
tar -cf build.tar --exclude=node_modules *
echo 'Transferring...'
scp ./build.tar pi@$MQTT_PI_IP:/home/pi/mqttserver_build.tar
echo 'Cleaning up...'
rm ./build.tar
echo 'Extracting at destination...'
ssh pi@$MQTT_PI_IP "rm -r /home/pi/mqttserver && mkdir /home/pi/mqttserver && cd /home/pi/mqttserver && tar -xf ../mqttserver_build.tar && npm ci && pm2 restart ../ecosystem.config.js"
echo 'Done!'
