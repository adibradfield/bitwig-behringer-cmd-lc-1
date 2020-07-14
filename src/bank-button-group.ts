class BankButtonGroup{
    private buttons:BankButton[];

    constructor(midiAddresses:number[], private onBankChanged: (index: number) => void){
        this.buttons = midiAddresses.map((address) => new BankButton(address, this));

        this.buttons.forEach((button) => ControlCollection.Instance.register(button));
    }

    onBankButtonActivated(button:BankButton){
        var index = this.buttons.indexOf(button);
        this.onBankChanged(index);
    }

    setIndex(index:number){
        this.buttons.forEach((button, i) => {
            if(i == index){
                button.setState(MarkedButtonState.On);
            }
            else{
                button.setState(MarkedButtonState.Off);
            }
        });
    }
}