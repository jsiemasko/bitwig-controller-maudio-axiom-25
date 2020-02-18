# Bitwig controller script for the M-Audio Axiom 25

This script was written for a Axiom 25 on a modified version of factory preset 1, i.e. the state of the keyboard after a factory reset.

## Installation
See installation instructions: [Controller Script Installation Guide](https://www.bitwig.com/en/community/control_scripts/installation_guide)

In order to use the encoder mappings a preset needs to be modified on the Hardware.  Instructions are included in the controller script help file.

## Usage
The script will provide 2 different Note Inputs, one from the keys and one from the drum pads.
The encoders map to the macros of the main device on the current track.
Transport controls are mapped as follows:
| Control      | Mapping                    |
| ------------ | -------------------------- |
| Loop         | Show VST GUI               |
| Rewind       | Select previous track      |
| Fast Forward | Select next track          |
| Stop         | Stop the transport         |
| Play         | Play / Pause the transport |
| Record       | Record on armed tracks     |

## History
### 1.0
* Changed auto-detect name to match what my Axiom was showing.
* Added Drum Pads as a separate note input.
* Removed encoder toggle to CC mode.
* Changed encoders to work in relative mode rather than sending absolute CC values.

## Credits
Forked from: https://github.com/teetrinkers/bitwig-controller-maudio-axiom-25