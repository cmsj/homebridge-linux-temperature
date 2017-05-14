# homebridge-pi

A homebridge LM75 temperature sensor for Banana Pi.
Based on origial code by Mark Webb-Johnson <mark@webb-johnson.net>.
See original code here: https://github.com/markwj/homebridge-pi


# Installation

1. To setup on Banana Pi follow directions at this link http://forum.banana-pi.org/t/bpi-m3-bpi-temperature-lm75-module-and-how-to-use/1075
2. Install Homebridge using: `npm install -g homebridge`
3. Install this plugin using: `npm install -g homebridge-pi-lm75`
4. Update your Homebridge `config.json` using the sample below.

# Configuration

```json
{
  "accessory": "PiTemperature",
  "name": "Raspberry PI Temperature"
}
```

Fields:

* `accessory` must be "PiTemperature" (required).
* `name` is the name of the published accessory (required).

