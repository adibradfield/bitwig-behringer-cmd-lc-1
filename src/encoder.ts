class Encoder extends Control{
    registeredStatusCodes: number[] = [ControllerMidiMapping.ControlChange];

    onChange: (value: number) => void = () => {};

    onMidiInput(status: number, data2: number): void {
        if(status == ControllerMidiMapping.ControlChange){
            var diff = data2 - 64;
            this.onChange(diff);
        }
    }

    reset(): void {
        this.setValue(0);
    }

    setValue(value:number){
        this.sendMidiOutput(ControllerMidiMapping.ControlChange, value);
    }
}