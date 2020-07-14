class Track{
    private track:API.Track;
    constructor(private trackBank:API.TrackBank, index:number){
        this.track = trackBank.getTrack(index);
        var trackMapping = new TrackMidiMapping(index);

        ControlCollection.Instance.register(new ToggleButton(trackMapping.mute, this.track.mute()));
        ControlCollection.Instance.register(new ToggleButton(trackMapping.solo, this.track.solo()));
        ControlCollection.Instance.register(new ToggleButton(trackMapping.record, this.track.arm()));

        var clipButtons = [0,1,2,3,4,5,6,7].map((index) => new ClipButton(trackMapping.clips[index], this.track.clipLauncherSlotBank(), index));
        clipButtons.forEach((button) => ControlCollection.Instance.register(button));
    }
}