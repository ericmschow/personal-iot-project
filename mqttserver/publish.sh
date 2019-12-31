echo 'Destination IP (MQTT_PI_IP): '$MQTT_PI_IP
echo 'Does this look correct? [y/N]?'
read choice
if [ "$choice" != "y" ]; then
    exit
fi
echo 'Archiving...'
tar -cf build.tar --exclude=node_modules *
echo 'Transferring...'
scp ./build.tar pi@$MQTT_PI_IP:/home/pi/mqttserver
echo 'Cleaning up...'
rm ./build.tar
echo 'Extract at target location with tar -xf in case you forgot the basic command'
