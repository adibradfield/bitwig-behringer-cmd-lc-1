class EncoderBank{
    constructor(){
        var cursorTrack: API.CursorTrack = host.createArrangerCursorTrack(0, 0);
        var cursorDevice: API.PinnableCursorDevice = cursorTrack.createCursorDevice('encoderBankDevice', "LC-1 Device", 0, CursorDeviceFollowMode.FOLLOW_SELECTION);
        var cursorRemotePage: API.ParameterBank | any = cursorDevice.createCursorRemoteControlsPage("LC-1 Remote Control", 8, "");
        var remotePage = cursorRemotePage;
        var pageIndex: API.SettableIntegerValue = remotePage.selectedPageIndex();

        var buttonGroup = new BankButtonGroup(ControllerMidiMapping.BankSelector.slice(0, 4), (index) => {
            pageIndex.set(index);
        });
        pageIndex.addValueObserver((index) => buttonGroup.setIndex(index), 0);

        var parameterBank:API.ParameterBank = cursorRemotePage;
        ControllerMidiMapping.Encoder.forEach((midiAddress, index) => {
            var encoder = new ParameterEncoder(midiAddress, parameterBank.getParameter(index));
            ControlCollection.Instance.register(encoder);
        })
    }
}