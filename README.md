# MY IOT REPO

I made this to keep track of what I did setting up my IOT network, for two purposes.

1. Practice documenting a project since it's been a while

2. Have documentation for when I inevitably want to touch this again in the future, after the implementation details have faded from memory

## Goals

1. Get my IOT devices working
2. Practice networking
3. Practice working with hardware/firmware since I've been exclusively software the past couple years
4. Learn MQTT

## Requirements

1. Devices should not have any access to my main router, for security.
2. I should not have to install a phone app to interact with the devices.
3. I should be able to activate the device with a single tap on my phone.

## Overall implementation

1. A Raspberry Pi 4 that serves as a wireless access point, without a bridge to my router, solving requirement 1

3. Smart Devices have been configured through tuya-convert to run Tasmota, an open source (but still not necessarily safe) smart device firmware that accepts MQTT, solving requirement 2

2. Pi4 runs an Express.js server (through PM2) that listens on my main network for basic GET endpoints to toggle smart devices via MQTT over the Pi's network. Firefox Focus shortcuts to these endpoints were saved to my phone's desktop, which works well enough to solve requirement 3 

## Steps to get new device operating

1. `ssh new_pi_user@ip:custom_ssl_port`
2. `cd tuya-convert`
3. `./start_flash`
3. (Note) Needed to add the line `ETH=eth0` to the tuya-convert config file since `wlan0` is not pointed outside. It still took multiple tries for each device
4. Follow the instructions; connect smartphone to the new AP started by the script, long press button on plug til flashing quickly, then hit enter on the console
5. Flash tasmota when prompted
7. On Pi, run `sudo systemctl start dnsmasq` and `sudo systemctl start hostapd` to get Pi broadcasting its Pi-fi
6. Connect smartphone to the wifi `tasmota_####` broadcast by the device and browse to `192.168.4.1`
7. Set up device's wifi to connect to Pi-fi. SSID case sensitive as well as pass of course.
8. Connect to the pi-fi with a smartphone.
9. On Pi `arp -a` to find new IP address for tasmota device
10. Navigate to that IP in smartphone browser and set up template https://templates.blakadder.com/awp04l.html
11. (Note) If it doesn't work there is a submenu where you make sure FLAG is set to 0 (example to copy and paste: `{"NAME":"AWP04L","GPIO":[57,255,255,131,255,134,0,0,21,17,132,56,255],"FLAG":0,"BASE":18}`
12. Change client and topic in mqtt settings to something like `coffee` or `lamp` and Friendly Name in other settings to same

## Steps to install server

1. Setup wifi on Pi (see documentation)
2. Install nvm, mosquitto, pm2
3. Add env vars to .bashrc
4. Set destination IP address to env variable in publish script
5. Use publish script
6. Setup pm2 via `pm2 start index.js --name=IOTServer`
7. `pm2 startup` and `pm2 save`

## MQTT related
* Can test from pi with `mosquitto_sub -t mqtt_test` and `mosquitto_pub -t mqtt_test -m test` in two separate sshs
* If 'connection refused' need to run `mosquitto -d` and `sudo systemctl enable mosquitto.service`
* From docs: Commands over MQTT are issued by using cmnd/%topic%/<command> <parameter> where %topic% is the topic of the device you're sending the command to. If there is no <parameter> (an empty MQTT message/payload), a query is sent for current status of the <command>.
* Topics are `coffee` or `lamp`
* Example web request: http://[ip]/cm?cmnd=Power%20TOGGLE
* Example MQTT cli request: mosquitto_pub -u [user] -P [pwd] -t cmnd/lamp/Power -m TOGGLE
* (Note) mqtt module connection string must explicitly state `mqtt://` in url. Does not throw a connection error.

## Documentation/Tutorials followed

1. Setting up wifi on Pi4, with eth0 https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md (up to the iptables stuff which was not followed, since the goal was to not allow true network access
2. iptables primer https://www.hostinger.com/tutorials/iptables-tutorial
3. how to set up post-flash https://everythingsmarthome.co.uk/howto/wifi-dimmer-switch-with-tasmota-tuya-dimmer-guide/
4. video on flashing thru tuya-convert https://asciinema.org/a/2aDZweVGfliwc9TjB1ncwmKvm
5. Github search for issues specific to plug model https://github.com/arendst/Tasmota/issues?utf8=%E2%9C%93&q=is%3Aissue+AWP04L
6. Getting Pi Zero (no eth0) to broadcast AP as well as listen to main wifi https://github.com/peebles/rpi3-wifi-station-ap-stretch 
### Potential next steps

1. Figure out how to do DNS on my local network such that my saved links aren't hardcoded IPs

1. Liveness probe on the API that pings me if it crashes, to avoid the disappointment of a failed coffeepot start request. (pm2 should make this a non-issue but still)

1. Implement debouncing on the controllers, due to this bug: If I open the saved link on my phone, minimize the browser, and open the link a second time, it results in a double GET to the server and thus the light turning quickly on and off. This is likely because Firefox Focus is perfoming another GET request on the already-open tab prior to switching to the new one. However, debouncing a controller is more or less telling your webserver to not serve webs sometimes; it seems like an oxymoron. it could possibly go on the `publishMessage` function either in the controller or in the `MqttHandler` but the bug isn't worth investing that much time into, because: 

A reasonable workaround exists by just tapping the prominent "close all tabs" button in Firefox Focus after opening the tab. (This does violate the spirit of my acceptance criteria #3, as even though the device is activated with the first tap, I still ultimately have to do multiple taps to reset for a second toggle. But I don't think it's possible to make my Node server's http response automatically close my phone browser's tab, or to make the phone's saved link automatically close the application after opening. This is just a natural consequence of using GET requests to trigger these calls. If I had these public-facing and a spider crawled my server, my plugs would come on without my input. But, I wanted one click to activate, so that was the sacrifice. Using a POST via an html form would be safer, but take more taps. 

2. Consider making a frontend app for my server with toggle widgets. This seems like the correct way to solve the bug above. I've never made an android app, so this would be a substantial undertaking. There are likely existing apps that have buttons that can make API calls, but that brings the security question back into the fore.

3. Have the server log or report the smart plugs power draw data through MQTT. This would be fun but mostly useless.

4. Add mosquitto to pm2 via a shell script or otherwise daemonize it. (should be already through the systemctl service setup but it's crashed once, it seems. Or the pi itself crashed and mosquitto didn't come back up)

## Retrospective thoughts

The project went surprisingly smoothly. From unboxing to having both devices behaving as expected took only two days of full-time work. The biggest challenge was setting up MQTT, in particular Mosquitto and getting the node.js app connecting to it. The docs for Tasmota's syntax were a little unclear also, but that's par for the course. (Like I said above, half the reason I wanted to document this so thoroughly was because I haven't gotten much practice with that recently.) I was glad to have docs at all. 

I wound up pre-planning the details less than I usually do for my projects, and that was okay. I began with the vision of two of the three requirements outlined above, with the plan of using the open-source app Home Assistant for my phone. But digging into Tasmota showed the MQTT setup shouldn't be that hard, and I figured making an express server to do it would be more secure, more extensible, and more _fun_ than learning to set up someone else's app.  

Maybe I got lucky since I could OTA flash the firmware, but my last experience with hardware (when I'd had only four months experience) was significantly more frustrating. This has tempered my self-concept of not being a "hardware guy".

If I get more smart devices I will revisit this repo. Depending on their functionality, the app is probably the next step in order to keep my phone's screen from getting cluttered with shortcuts.

Overall, a good way to spend a couple days off work.
