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
echo 'Extracting at destination...'
ssh pi@$MQTT_PI_IP "cd /home/pi/mqttserver && tar -xf ./build.tar"
