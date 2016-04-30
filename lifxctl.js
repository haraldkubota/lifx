'use strict';

/*
Command line tool
lifx --id LAMPID --cmd on|off|... more lamp-name command parameter1 parameter2...

Author: Harald Kubota
Git: https://github.com/haraldkubota/lifx

*/

var argv = require('minimist')(process.argv.slice(2));
var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

// Check minimum options and syntax in general

function checkArgs() {
  function displayUsage() {
    console.log('Usage:');
    console.log('lifx --id LAMPID --cmd on|off|(color --hue HUE --saturation SAT --brightness BRI)');
    console.log('Optional parameter (with default):');
    console.log('  --kelvin 5000');
    console.log('  --duration 0');
    console.log('  --timeout 10000');
    console.log('  --debug false');
    process.exit(20);
  }

  // cmd and id is always needed
  if (typeof argv.cmd === 'undefined' || typeof argv.id === 'undefined') {
    displayUsage();
  }

  // Defaults
  // duration for on/off and related
  if (typeof argv.duration === 'undefined') {
    argv.duration=0;
  }
  // This script times out after this many milli seconds
  if (typeof argv.timeout === 'undefined') {
    argv.timeout=10000;
  }
  // Default color temparture
  if (typeof argv.kelvin === 'undefined') {
    argv.kelvin=5000;
  }
  // Debug
  if (typeof argv.debug === 'undefined') {
    argv.debug=false;
  }

  // More complex commands with mandatory parameters
  switch(argv.cmd) {
    case 'color': if (typeof argv.hue === 'undefined'
      || typeof argv.saturation === 'undefined'
      || typeof argv.brightness === 'undefined') {
        displayUsage();
        break;
    } 
  }
}

checkArgs();

// Most functions have a callback for error checking.
// We use it to confirm a command succeeded
// and if not, we exit with a different return code.
// In all cases here we exit the program.

function checkCmd(err) {
  if (err) {
    console.error('Error: ', err);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// If something went wrong and the light we look for does not come online,
// then time out and exit 

setTimeout(function(){
  console.error('Timeout');
  process.exit(9);
  }, argv.timeout);

// Most action happens here: when detecting a light
client.on('light-new', function(light) {
  if (argv.debug) {
    console.log('New light found.');
    console.log('ID: ' + light.id);
    console.log('IP: ' + light.address + ':' + light.port);
  }
  light.getState(function(err, info) {
    if (err) {
      console.err(err);
      process.exit(10);
      }
    if (argv.debug) {
      console.log('Label: ' + info.label);
      console.log('Power:', (info.power === 1) ? 'on' : 'off');
      console.log('Color:', info.color, '\n');
      };
    if (info.label === argv.id) {
      switch (argv.cmd) {
        case 'on':    light.on(argv.duration, checkCmd);
                      break;
        case 'off':   light.off(argv.duration, checkCmd);
                      break;
        case 'color': light.color(argv.hue, argv.saturation, argv.brightness, argv.kelvin, argv.duration, checkCmd);
                      break;
      }
    }
  });
});

client.on('light-online', function(light) {
  if (argv.debug) {
    console.log('Light back online. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
  }
});

client.on('light-offline', function(light) {
  if (argv.debug) {
    console.log('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
  }
});

client.on('listening', function() {
  var address = client.address();
  if (argv.debug) {
    console.log('Started LIFX listening on ' + address.address + ':' + address.port + '\n');
  }
});

if (argv.debug) {
  client.setDebug(true);
}

client.init();
