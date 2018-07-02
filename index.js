"use strict";

var fs = require('fs');

var Service, Characteristic;
var temperatureService;

module.exports = function (homebridge)
  {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-linux-temp", "LinuxTemperature", LinuxTemperatureAccessory);
  }

function LinuxTemperatureAccessory(log, config)
  {
  this.log = log;
  this.name = config['name'];
  this.lastupdate = 0;
  this.sensor_path = config['path'];
  this.divisor = config['divisor'];
  }

LinuxTemperatureAccessory.prototype =
  {
  getState: function (callback)
    {
    // Only fetch new data once per minute
    if (this.lastupdate + 60 < (Date.now() / 1000 | 0))
      {
      var data = fs.readFileSync(this.sensor_path, 'utf8');
      if (typeof data == 'undefined') { return this.log("Failed to read temperature file"); }
      this.temperature = (0.0+parseInt(data))/this.divisor;
      }
    this.log("Temperature at " + this.temperature);
    temperatureService.setCharacteristic(Characteristic.CurrentTemperature, this.temperature);
    callback(null, this.temperature);
    },

  identify: function (callback)
    {
    this.log("Identify requested!");
    callback(); // success
    },

  getServices: function ()
    {
    var informationService = new Service.AccessoryInformation();

    var data = fs.readFileSync('/proc/cpuinfo', 'utf8');
    if (typeof data == 'undefined') { return this.log("Failed to read /proc/cpuinfo"); }
    var model = data.match(/model name\s+\:\s*(\S+)/)[1];
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Linux")
      .setCharacteristic(Characteristic.Model, model);
    this.log("Model " + model);

    temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getState.bind(this));

    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({minValue: -30});

    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({maxValue: 120});

    return [informationService, temperatureService];
    }
  };

if (!Date.now)
  {
  Date.now = function() { return new Date().getTime(); }
  }
