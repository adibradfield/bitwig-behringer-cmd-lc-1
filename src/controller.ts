class Controller{
    private tracks:Track[] = [];

    init() {
        ControlCollection.Instance.init();
        this.setupMidiInputMapping();

        var trackBank = host.createMainTrackBank(4, 0, 8);
        this.tracks = [new Track(trackBank, 0), new Track(trackBank, 1), new Track(trackBank, 2), new Track(trackBank, 3)]
        
        var navigator = new ClipLauncherNavigator(trackBank);
        var encoderBank = new EncoderBank();
    }

    exit() {
        ControlCollection.Instance.reset();
    }

    private setupMidiInputMapping(){
        host.getMidiInPort(0).setMidiCallback((status, data1, data2) => {
            var control = ControlCollection.Instance.get(data1, status);
            println("MIDI In: " + status + " " + data1 + " " + data2);
            if(control){
                control.onMidiInput(status, data2);
            }
        });
    }
}