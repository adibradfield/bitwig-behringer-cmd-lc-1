/// <reference path="./button.ts" />

class MarkedButton extends Button{
    reset(): void {
        this.setState(MarkedButtonState.Off);
    }
    setState(state:MarkedButtonState){
        this.SetLightState(state);
    }
}

enum MarkedButtonState{
    Off = 0x00,
    On = 0x01,
    Blinking = 0x02
}