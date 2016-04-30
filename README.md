# lifx

Control lifx lamps via node.js

## Examples

alias lifx="node lifxctl.js"

lifx --id "No1" --cmd on
lifx --id "No1" --cmd off --duration 2000
life --id "No2" --color --hue 0 --saturation 80 --brightness 80
life --id "No2" --color --hue 0 --saturation 80 --brightness 80 --duration 2000 --debug --timeout 5000

## Optional parmeters

--duration 0
--debug
--timeout 10000
--kelvin 5000

## Return Codes

20: Syntax error
9: Timeout happened. Command might not have reached the lamp.
10: Error while doing getState()
0: No errors.


