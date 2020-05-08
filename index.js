"use strict";

var fs = require('fs');

var Service, Characteristic;
var temperatureService;
var { execSync } = require("child_process");

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
  this.sensor_path = config['sensor_path'];
  this.divisor = config['divisor'];
  this.pollingInterval = config['pollingInterval'];

  var that = this;
  // Start periodic polling
  if(this.pollingInterval && this.pollingInterval > 0){
      setTimeout(function () {
        that.backgroundPolling()
      }, this.pollingInterval);
    }
  }

LinuxTemperatureAccessory.prototype =
  {
    backgroundPolling: function () {
      // Update Temperature
      this.getState(function (error, temperature) {
        if (error) {
          this.log(error);
        }
      }.bind(this));
  
      var that = this;
      setTimeout(function () {
        // Recursive call after certain time
        that.backgroundPolling();
      }, this.pollingInterval);
    },
    getState: function (callback)
    {
      var data = fs.readFileSync(this.sensor_path, 'utf8');
      if (typeof data == 'undefined') { return this.log("Failed to read temperature file"); }
      this.temperature = (0.0+parseInt(data))/this.divisor;

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

    var data = execSync("cat /proc/cpuinfo | grep 'model name' | uniq | cut -d':' -f2|awk '{$1=$1};1'", { encoding: "utf8" });
    if (typeof data == 'undefined') { return this.log("Failed to read /proc/cpuinfo"); }
    
    var os;
    
    try {
      os = execSync("lsb_release -d|cut -d':' -f2|awk '{$1=$1};1'", { encoding: "utf8" });
    } catch (e) {
      this.log(e)
    }

    if (!os){
      os = "Linux";
    }

    informationService
      .setCharacteristic(Characteristic.Manufacturer, os)
      .setCharacteristic(Characteristic.Model, data);
    this.log("Model " + data);

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
