class TrackMidiMapping{
    mute:number;
    solo:number;
    record:number;
    clips:number[];
    constructor(index:number){
        this.mute = ControllerMidiMapping.Mute[index];
        this.solo = ControllerMidiMapping.Solo[index];
        this.record = ControllerMidiMapping.Record[index];
        this.clips = ControllerMidiMapping.Clip[index];
    }
}