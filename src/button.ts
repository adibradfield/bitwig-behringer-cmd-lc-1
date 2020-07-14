/// <reference path="./control.ts" />

abstract class Button extends Control{
    registeredStatusCodes = [ControllerMidiMapping.NoteOn, ControllerMidiMapping.NoteOff];
    onKeyDown:()=>void = ()=>{};
    onKeyUp:()=>void = ()=>{};

    onMidiInput(status:number, data2:number){
        switch(status){
            case ControllerMidiMapping.NoteOn:
                this.onKeyDown();
                break;
            case ControllerMidiMapping.NoteOff:
                this.onKeyUp();
                break;
        }
    }

    protected SetLightState(state:number){
        this.sendMidiOutput(ControllerMidiMapping.NoteOn, state);
    }
}