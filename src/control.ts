abstract class Control{
    abstract registeredStatusCodes: number[];

    constructor(public midiAddress:number){}

    abstract onMidiInput(status:number, data2:number):void;
    abstract reset():void;

    protected sendMidiOutput(messageType: number, value: number):void{
        println("MIDI Out: " + messageType + " " + this.midiAddress + " " + value);
        host.getMidiOutPort(0).sendMidi(messageType, this.midiAddress, value);
    }
}