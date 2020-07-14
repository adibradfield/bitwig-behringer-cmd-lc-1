# bitwig-behringer-cmd-lc-1
Bitwig Controller Script for the Behringer CMD LC-1

## Controls
### Encoders 1-8
These encoders all control the parameters for the currently selected device. The parameters that are being controlled will be displayed in the status bar of Bitwig

### Bank Selectors 1-4
These select which page of parameters the encoders are currently controlling. The button for the current page will be lit up in blue

### Bank Selectors 5-6
These allow you to scroll the tracks of the clip launcher. 5 will scroll backwards and 6 will scroll forwards. If it is possible to scroll in either direction, that button will be lit in blue

### Bank Selectors 7-8
These allow you to scroll the scenes of the clip launcher. 7 will scroll backwards and 8 will scroll forwards. If it is possible to scroll in either direction, that button will be lit in blue

### Clip Buttons
To set the colour of a clip, you need to set the colour in Bitwig. Due to the limited number of colours available on this controller, it's not the most intuitive. If the colour in Bitwig is closest to:
- Red - The colour on the controller will be amber
- Blue - The colour on the controller will be blue
- Green - The colour on the controller will be purple

Whilst a clip is currently playing, the colour will be green

If a clip is queued to be played, the colour will alternate between amber and green

To launch a clip, just press the respective button

### Mute/Solo/Arm
These correspond to the respective controls for the track in the clip bank. When it is enabled, it will be lit in blue, otherwise it will be amber
