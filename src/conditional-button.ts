/// <reference path="./marked-button.ts" />

class ConditionalButton extends MarkedButton{
    constructor(midiAddress:number, condition:API.BooleanValue, action:()=>void){
        super(midiAddress);

        condition.addValueObserver((value) => {
            this.setState(value? MarkedButtonState.On : MarkedButtonState.Off);
        });

        this.onKeyDown = () => {
            if(condition.get()){
                action();
            }
        }
    }
}