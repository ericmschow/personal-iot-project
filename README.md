# MY IOT REPO

I made this to keep track of what I did setting up my IOT network, for two purposes.

1. Practice documenting a project

2. Have documentation for when I inevitably want to touch this again in the future after the details have faded from memory

## Overall implementation

1. Pi4 serving as a wireless access point without a bridge to my router, to keep foreign agents from spying on my devices or reporting back 

3. Devices have been configured through tuya-convert to run Tasmota, an open source smart device firmware that accepts MQTT so I did not have to install any smartphone app

2. Pi4 runs a node server listening on my main network for basic POST endpoints to toggle smart devices via MQTT


## Steps to get new device operating

1. `ssh new_pi_user@ip:custom_ssl_port`
2. `cd tuya-convert`
3. Needed to add the line `ETH=eth0` to the config file since `wlan` is not pointed outside. It still took multiple tries
3. `./start_flash`
4. Follow the instructions; connect smartphone to the new AP started by the script, long press button on plug til flashing quickly, then hit enter on the console
5. Flash tasmota when prompted
6. Connect to the wifi `tasmota_####` broadcast by the device and browse to `192.168.4.1`
7. run `sudo systemctl start dnsmasq` and `sudo systemctl start hostapd` to get Pi broadcasting
7. Set up wifi to connect to the one broadcast by Pi (pi-fi). SSID case sensitive as well as pass of course.
8. Connect to the pi-fi with a smartphone. 
9. On Pi `arp -a` to find new IP address
10. Navigate to that IP in smartphone browser and set up template https://templates.blakadder.com/awp04l.html
11. If it doesn't work there is a submenu where you make sure FLAG is set to 0 (should look like `{"NAME":"AWP04L","GPIO":[57,255,255,131,255,134,0,0,21,17,132,56,255],"FLAG":0,"BASE":18}`
12. Change client and topic in mqtt settings to something like `coffee` or `lamp` and Friendly Name in other settings to same

## MQTT related
* Can test from pi with `mosquitto_sub -t mqtt_test` and `mosquitto_pub -t mqtt_test -m test` in two separate sshs
* If 'connection refused' need to run `mosquitto -d` and `sudo systemctl enable mosquitto.service`
* From docs: Commands over MQTT are issued by using cmnd/%topic%/<command> <parameter> where %topic% is the topic of the device you're sending the command to. If there is no <parameter> (an empty MQTT message/payload), a query is sent for current status of the <command>.
* Topics are `coffee` or `lamp`
* Example web request: http://<ip>/cm?cmnd=Power%20TOGGLE
* Example MQTT cli request: mosquitto_pub -u [user] -P [pwd] -t cmnd/lamp/Power -m TOGGLE
* mqtt module connection string must explicitly state `mqtt://` in url

## Documentation/Tutorials followed

1. Setting up wifi on Pi https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md (up to the iptables stuff which was not followed, since the goal was to not allow true network access
2. iptables primer https://www.hostinger.com/tutorials/iptables-tutorial
3. how to set up post-flash https://everythingsmarthome.co.uk/howto/wifi-dimmer-switch-with-tasmota-tuya-dimmer-guide/
4. video on flashing thru tuya-convert https://asciinema.org/a/2aDZweVGfliwc9TjB1ncwmKvm
5. Github search for issues specific to plug model https://github.com/arendst/Tasmota/issues?utf8=%E2%9C%93&q=is%3Aissue+AWP04L
