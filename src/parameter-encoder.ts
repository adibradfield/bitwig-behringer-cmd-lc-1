class ParameterEncoder extends Encoder{
    constructor(midiAddress:number, parameter:API.Parameter){
        super(midiAddress);
        parameter.setIndication(true);

        this.onChange = (value) => parameter.inc(value, 128);

        parameter.addValueObserver((value) => {
            println("Parameter Value: " + value);
            this.setValue(Math.floor(value * 14) + 1);
        });
    }
}