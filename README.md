# homebridge-linux-temperature

A homebridge temperature sensor for Linux temperatures.
Based on the fork by Peter Harry at https://github.com/GreyPeter/homebridge-pi-lm75
Based on origial code by Mark Webb-Johnson <mark@webb-johnson.net>.
See original code here: https://github.com/markwj/homebridge-pi


# Installation

1. Install Homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-linux-temperature`
3. Update your Homebridge `config.json` using the sample below.

# Configuration

```json
{
  "accessory": "LinuxTemperature",
  "name": "Sensor Temperature",
  "sensor_path": "/sys/bus/platform/devices/coretemp.0/hwmon/hwmon0/temp1_input",
  "divisor": 1000,
  "pollingInterval": 3000
}
```

Fields:

* `accessory` must be "LinuxTemperature" (required).
* `name` is the name of the published accessory (required).
* `sensor_path` is the path to a file (typically in `/sys` or `/proc` that contains just the temperature value (required).
* `divisor` is the amount to divide the temperature value by (e.g. typically Linux provides milli-degrees, so a divisor of 1000 gives degrees)
* `pollingInterval` (optional) determines how often temperature is polled in the background (in miliseconds). This is useful if you want to use the temperature to trigger automations (otherwise temperature is only updated when Homekit is opened). If it is 0 or absent, no background polling happens.

