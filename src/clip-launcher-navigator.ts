class ClipLauncherNavigator{
    constructor(trackBank: API.TrackBank){
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[4], trackBank.canScrollBackwards(), () => {
            trackBank.scrollBackwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[5], trackBank.canScrollForwards(), () => {
            trackBank.scrollForwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[6], trackBank.sceneBank().canScrollBackwards(), () => {
            trackBank.sceneBank().scrollBackwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[7], trackBank.sceneBank().canScrollForwards(), () => {
            trackBank.sceneBank().scrollForwards();
        }));
    }
}