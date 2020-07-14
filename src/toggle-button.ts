class ToggleButton extends MarkedButton{
    constructor(midiAddress:number, value:API.SettableBooleanValue){
        super(midiAddress);
        value.addValueObserver((value) => this.onValueChange(value));
        this.onKeyDown = this.onTogglePress(value);
    }

    private onValueChange(newValue:boolean){
        this.setState(newValue ? MarkedButtonState.On : MarkedButtonState.Off);
    }

    private onTogglePress(value:API.SettableBooleanValue){
        return function(){
            value.toggle();
        }
    }
}