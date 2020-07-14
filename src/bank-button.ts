/// <reference path="./marked-button.ts" />

class BankButton extends MarkedButton{
    constructor(midiAddress:number, group: BankButtonGroup){
        super(midiAddress);

        this.onKeyDown = () => group.onBankButtonActivated(this);
    }
}