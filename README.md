# lifx

Control lifx lamps via node.js

## Examples

```
alias lifx="node lifxctl.js"

lifx --id "No1" --cmd on
lifx --id "No1" --cmd off --duration 2000
life --id "No2" --color --hue 0 --saturation 80 --brightness 80
life --id "No2" --color --hue 0 --saturation 80 --brightness 80 --duration 2000 --debug --timeout 5000
```

## Optional parmeters

```
--duration 0      // transition duration in ms
--debug           // debug messages
--timeout 10000   // timeout in case the lamp cannot be found
--kelvin 5000     // white color temperature
```

## Return Codes

* 0: No errors.
* 9: Timeout happened. Command might not have reached the lamp.
* 10: Error while doing getState()
* 20: Syntax error

## Some history

There's some history behind this project.
For those who are curious, here my [blog](http://harald.studiokubota.com/wordpress/index.php/2016/04/30/my-lifx-bulbs-resurrected/) entry about it.
