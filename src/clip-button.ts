class ClipButton extends Button{
    private hasContent: boolean = false;
    private isQueued: boolean = false;
    private isPlaying: boolean = false;
    private red:number = 0;
    private green:number = 0;
    private blue:number = 0;

    constructor(midiAddress: number, clipBank: API.ClipLauncherSlotBank, index: number){
        super(midiAddress);

        clipBank.getItemAt(index).hasContent().addValueObserver((newValue) => {
            this.hasContent = newValue;
            this.setLightFromState();
        });

        clipBank.getItemAt(index).isPlaybackQueued().addValueObserver((newValue) => {
            this.isQueued = newValue;
            this.setLightFromState();
        });

        clipBank.getItemAt(index).isPlaying().addValueObserver((newValue) => {
            this.isPlaying = newValue;
            this.setLightFromState();
        });

        clipBank.getItemAt(index).color().addValueObserver((red, green, blue) => {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.setLightFromState();
        });

        this.onKeyDown = () => {
            clipBank.getItemAt(index).launch();
        }
    }

    reset(): void {
        this.setState(ClipButtonState.AmberSolid);
    }
    setState(state:ClipButtonState){
        this.SetLightState(state);
    }

    private setLightFromState(): void{
        this.setState(this.getColourFromState());
    }

    private getColourFromState(): ClipButtonState{
        if(!this.hasContent){
            return ClipButtonState.Off;
        }
        if(this.isPlaying){
            return ClipButtonState.GreenSolid;
        }
        if(this.isQueued){
            return ClipButtonState.GreenBlinking;
        }

        if(this.red >= this.green && this.red >= this.blue){
            return ClipButtonState.AmberSolid;
        }
        if(this.green >= this.red && this.green >= this.blue){
            return ClipButtonState.PurpleSolid;
        }
        else{
            return ClipButtonState.BlueSolid;
        }
    }
}

enum ClipButtonState{
    Off = 0x7F,
    GreenSolid = 0x01,
    GreenBlinking = 0x02,
    PurpleSolid = 0x03,
    PurpleBlinking = 0x04,
    BlueSolid = 0x05,
    BlueBlinking = 0x06,
    AmberSolid = 0x07,
    AmberBlinking = 0x08 
}