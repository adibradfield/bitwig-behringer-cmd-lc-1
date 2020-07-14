"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var controller;
loadAPI(11);
host.defineController("Behringer", "CMD LC-1", "1.0.0", "2c4aca7d-9a80-4284-838a-391dd6c8290e", "Adrian Bradfield");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["CMD LC-1"], ["CMD LC-1"]);
function init() {
    controller = new Controller();
    controller.init();
}
function exit() {
    controller.exit();
}
var BankButtonGroup = /** @class */ (function () {
    function BankButtonGroup(midiAddresses, onBankChanged) {
        var _this = this;
        this.onBankChanged = onBankChanged;
        this.buttons = midiAddresses.map(function (address) { return new BankButton(address, _this); });
        this.buttons.forEach(function (button) { return ControlCollection.Instance.register(button); });
    }
    BankButtonGroup.prototype.onBankButtonActivated = function (button) {
        var index = this.buttons.indexOf(button);
        this.onBankChanged(index);
    };
    BankButtonGroup.prototype.setIndex = function (index) {
        this.buttons.forEach(function (button, i) {
            if (i == index) {
                button.setState(MarkedButtonState.On);
            }
            else {
                button.setState(MarkedButtonState.Off);
            }
        });
    };
    return BankButtonGroup;
}());
var Control = /** @class */ (function () {
    function Control(midiAddress) {
        this.midiAddress = midiAddress;
    }
    Control.prototype.sendMidiOutput = function (messageType, value) {
        println("MIDI Out: " + messageType + " " + this.midiAddress + " " + value);
        host.getMidiOutPort(0).sendMidi(messageType, this.midiAddress, value);
    };
    return Control;
}());
/// <reference path="./control.ts" />
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registeredStatusCodes = [ControllerMidiMapping.NoteOn, ControllerMidiMapping.NoteOff];
        _this.onKeyDown = function () { };
        _this.onKeyUp = function () { };
        return _this;
    }
    Button.prototype.onMidiInput = function (status, data2) {
        switch (status) {
            case ControllerMidiMapping.NoteOn:
                this.onKeyDown();
                break;
            case ControllerMidiMapping.NoteOff:
                this.onKeyUp();
                break;
        }
    };
    Button.prototype.SetLightState = function (state) {
        this.sendMidiOutput(ControllerMidiMapping.NoteOn, state);
    };
    return Button;
}(Control));
/// <reference path="./button.ts" />
var MarkedButton = /** @class */ (function (_super) {
    __extends(MarkedButton, _super);
    function MarkedButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarkedButton.prototype.reset = function () {
        this.setState(MarkedButtonState.Off);
    };
    MarkedButton.prototype.setState = function (state) {
        this.SetLightState(state);
    };
    return MarkedButton;
}(Button));
var MarkedButtonState;
(function (MarkedButtonState) {
    MarkedButtonState[MarkedButtonState["Off"] = 0] = "Off";
    MarkedButtonState[MarkedButtonState["On"] = 1] = "On";
    MarkedButtonState[MarkedButtonState["Blinking"] = 2] = "Blinking";
})(MarkedButtonState || (MarkedButtonState = {}));
/// <reference path="./marked-button.ts" />
var BankButton = /** @class */ (function (_super) {
    __extends(BankButton, _super);
    function BankButton(midiAddress, group) {
        var _this = _super.call(this, midiAddress) || this;
        _this.onKeyDown = function () { return group.onBankButtonActivated(_this); };
        return _this;
    }
    return BankButton;
}(MarkedButton));
var ClipButton = /** @class */ (function (_super) {
    __extends(ClipButton, _super);
    function ClipButton(midiAddress, clipBank, index) {
        var _this = _super.call(this, midiAddress) || this;
        _this.hasContent = false;
        _this.isQueued = false;
        _this.isPlaying = false;
        _this.red = 0;
        _this.green = 0;
        _this.blue = 0;
        clipBank.getItemAt(index).hasContent().addValueObserver(function (newValue) {
            _this.hasContent = newValue;
            _this.setLightFromState();
        });
        clipBank.getItemAt(index).isPlaybackQueued().addValueObserver(function (newValue) {
            _this.isQueued = newValue;
            _this.setLightFromState();
        });
        clipBank.getItemAt(index).isPlaying().addValueObserver(function (newValue) {
            _this.isPlaying = newValue;
            _this.setLightFromState();
        });
        clipBank.getItemAt(index).color().addValueObserver(function (red, green, blue) {
            _this.red = red;
            _this.green = green;
            _this.blue = blue;
            _this.setLightFromState();
        });
        _this.onKeyDown = function () {
            clipBank.getItemAt(index).launch();
        };
        return _this;
    }
    ClipButton.prototype.reset = function () {
        this.setState(ClipButtonState.AmberSolid);
    };
    ClipButton.prototype.setState = function (state) {
        this.SetLightState(state);
    };
    ClipButton.prototype.setLightFromState = function () {
        this.setState(this.getColourFromState());
    };
    ClipButton.prototype.getColourFromState = function () {
        if (!this.hasContent) {
            return ClipButtonState.Off;
        }
        if (this.isPlaying) {
            return ClipButtonState.GreenSolid;
        }
        if (this.isQueued) {
            return ClipButtonState.GreenBlinking;
        }
        if (this.red >= this.green && this.red >= this.blue) {
            return ClipButtonState.AmberSolid;
        }
        if (this.green >= this.red && this.green >= this.blue) {
            return ClipButtonState.PurpleSolid;
        }
        else {
            return ClipButtonState.BlueSolid;
        }
    };
    return ClipButton;
}(Button));
var ClipButtonState;
(function (ClipButtonState) {
    ClipButtonState[ClipButtonState["Off"] = 127] = "Off";
    ClipButtonState[ClipButtonState["GreenSolid"] = 1] = "GreenSolid";
    ClipButtonState[ClipButtonState["GreenBlinking"] = 2] = "GreenBlinking";
    ClipButtonState[ClipButtonState["PurpleSolid"] = 3] = "PurpleSolid";
    ClipButtonState[ClipButtonState["PurpleBlinking"] = 4] = "PurpleBlinking";
    ClipButtonState[ClipButtonState["BlueSolid"] = 5] = "BlueSolid";
    ClipButtonState[ClipButtonState["BlueBlinking"] = 6] = "BlueBlinking";
    ClipButtonState[ClipButtonState["AmberSolid"] = 7] = "AmberSolid";
    ClipButtonState[ClipButtonState["AmberBlinking"] = 8] = "AmberBlinking";
})(ClipButtonState || (ClipButtonState = {}));
var ClipLauncherNavigator = /** @class */ (function () {
    function ClipLauncherNavigator(trackBank) {
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[4], trackBank.canScrollBackwards(), function () {
            trackBank.scrollBackwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[5], trackBank.canScrollForwards(), function () {
            trackBank.scrollForwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[6], trackBank.sceneBank().canScrollBackwards(), function () {
            trackBank.sceneBank().scrollBackwards();
        }));
        ControlCollection.Instance.register(new ConditionalButton(ControllerMidiMapping.BankSelector[7], trackBank.sceneBank().canScrollForwards(), function () {
            trackBank.sceneBank().scrollForwards();
        }));
    }
    return ClipLauncherNavigator;
}());
/// <reference path="./marked-button.ts" />
var ConditionalButton = /** @class */ (function (_super) {
    __extends(ConditionalButton, _super);
    function ConditionalButton(midiAddress, condition, action) {
        var _this = _super.call(this, midiAddress) || this;
        condition.addValueObserver(function (value) {
            _this.setState(value ? MarkedButtonState.On : MarkedButtonState.Off);
        });
        _this.onKeyDown = function () {
            if (condition.get()) {
                action();
            }
        };
        return _this;
    }
    return ConditionalButton;
}(MarkedButton));
var ControlCollection = /** @class */ (function () {
    function ControlCollection() {
        this._internalCollection = {};
    }
    ControlCollection.prototype.init = function () {
    };
    ControlCollection.prototype.get = function (midiAddress, status) {
        var possibleMatches = this._internalCollection[midiAddress];
        var match = null;
        possibleMatches.forEach(function (control) {
            if (control.registeredStatusCodes.some(function (statusCode) { return statusCode == status; })) {
                match = control;
            }
        });
        return match;
    };
    ControlCollection.prototype.register = function (control) {
        if (!Array.isArray(this._internalCollection[control.midiAddress])) {
            this._internalCollection[control.midiAddress] = [];
        }
        this._internalCollection[control.midiAddress].push(control);
    };
    ControlCollection.prototype.reset = function () {
        var _this = this;
        Object.keys(this._internalCollection).forEach(function (key) {
            _this._internalCollection[parseInt(key)].forEach(function (control) { return control.reset(); });
        });
    };
    ControlCollection.Instance = new ControlCollection();
    return ControlCollection;
}());
var ControllerMidiMapping = /** @class */ (function () {
    function ControllerMidiMapping() {
    }
    ControllerMidiMapping.BankSelector = [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17];
    ControllerMidiMapping.Mute = [0x40, 0x41, 0x42, 0x43];
    ControllerMidiMapping.Solo = [0x44, 0x45, 0x46, 0x47];
    ControllerMidiMapping.Record = [0x48, 0x49, 0x4A, 0x4B];
    ControllerMidiMapping.Clip = [
        [0x20, 0x24, 0x28, 0x2C, 0x30, 0x34, 0x38, 0x3C],
        [0x21, 0x25, 0x29, 0x2D, 0x31, 0x35, 0x39, 0x3D],
        [0x22, 0x26, 0x2A, 0x2E, 0x32, 0x36, 0x3A, 0x3E],
        [0x23, 0x27, 0x2B, 0x2F, 0x33, 0x37, 0x3B, 0x3F]
    ];
    ControllerMidiMapping.Encoder = [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17];
    ControllerMidiMapping.NoteOn = 0x97;
    ControllerMidiMapping.NoteOff = 0x87;
    ControllerMidiMapping.ControlChange = 0xB7;
    return ControllerMidiMapping;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        this.tracks = [];
    }
    Controller.prototype.init = function () {
        ControlCollection.Instance.init();
        this.setupMidiInputMapping();
        var trackBank = host.createMainTrackBank(4, 0, 8);
        this.tracks = [new Track(trackBank, 0), new Track(trackBank, 1), new Track(trackBank, 2), new Track(trackBank, 3)];
        var navigator = new ClipLauncherNavigator(trackBank);
        var encoderBank = new EncoderBank();
    };
    Controller.prototype.exit = function () {
        ControlCollection.Instance.reset();
    };
    Controller.prototype.setupMidiInputMapping = function () {
        host.getMidiInPort(0).setMidiCallback(function (status, data1, data2) {
            var control = ControlCollection.Instance.get(data1, status);
            println("MIDI In: " + status + " " + data1 + " " + data2);
            if (control) {
                control.onMidiInput(status, data2);
            }
        });
    };
    return Controller;
}());
var EncoderBank = /** @class */ (function () {
    function EncoderBank() {
        var cursorTrack = host.createArrangerCursorTrack(0, 0);
        var cursorDevice = cursorTrack.createCursorDevice('encoderBankDevice', "LC-1 Device", 0, CursorDeviceFollowMode.FOLLOW_SELECTION);
        var cursorRemotePage = cursorDevice.createCursorRemoteControlsPage("LC-1 Remote Control", 8, "");
        var remotePage = cursorRemotePage;
        var pageIndex = remotePage.selectedPageIndex();
        var buttonGroup = new BankButtonGroup(ControllerMidiMapping.BankSelector.slice(0, 4), function (index) {
            pageIndex.set(index);
        });
        pageIndex.addValueObserver(function (index) { return buttonGroup.setIndex(index); }, 0);
        var parameterBank = cursorRemotePage;
        ControllerMidiMapping.Encoder.forEach(function (midiAddress, index) {
            var encoder = new ParameterEncoder(midiAddress, parameterBank.getParameter(index));
            ControlCollection.Instance.register(encoder);
        });
    }
    return EncoderBank;
}());
var Encoder = /** @class */ (function (_super) {
    __extends(Encoder, _super);
    function Encoder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registeredStatusCodes = [ControllerMidiMapping.ControlChange];
        _this.onChange = function () { };
        return _this;
    }
    Encoder.prototype.onMidiInput = function (status, data2) {
        if (status == ControllerMidiMapping.ControlChange) {
            var diff = data2 - 64;
            this.onChange(diff);
        }
    };
    Encoder.prototype.reset = function () {
        this.setValue(0);
    };
    Encoder.prototype.setValue = function (value) {
        this.sendMidiOutput(ControllerMidiMapping.ControlChange, value);
    };
    return Encoder;
}(Control));
var ParameterEncoder = /** @class */ (function (_super) {
    __extends(ParameterEncoder, _super);
    function ParameterEncoder(midiAddress, parameter) {
        var _this = _super.call(this, midiAddress) || this;
        parameter.setIndication(true);
        _this.onChange = function (value) { return parameter.inc(value, 128); };
        parameter.addValueObserver(function (value) {
            println("Parameter Value: " + value);
            _this.setValue(Math.floor(value * 14) + 1);
        });
        return _this;
    }
    return ParameterEncoder;
}(Encoder));
var ToggleButton = /** @class */ (function (_super) {
    __extends(ToggleButton, _super);
    function ToggleButton(midiAddress, value) {
        var _this = _super.call(this, midiAddress) || this;
        value.addValueObserver(function (value) { return _this.onValueChange(value); });
        _this.onKeyDown = _this.onTogglePress(value);
        return _this;
    }
    ToggleButton.prototype.onValueChange = function (newValue) {
        this.setState(newValue ? MarkedButtonState.On : MarkedButtonState.Off);
    };
    ToggleButton.prototype.onTogglePress = function (value) {
        return function () {
            value.toggle();
        };
    };
    return ToggleButton;
}(MarkedButton));
var TrackMidiMapping = /** @class */ (function () {
    function TrackMidiMapping(index) {
        this.mute = ControllerMidiMapping.Mute[index];
        this.solo = ControllerMidiMapping.Solo[index];
        this.record = ControllerMidiMapping.Record[index];
        this.clips = ControllerMidiMapping.Clip[index];
    }
    return TrackMidiMapping;
}());
var Track = /** @class */ (function () {
    function Track(trackBank, index) {
        var _this = this;
        this.trackBank = trackBank;
        this.track = trackBank.getTrack(index);
        var trackMapping = new TrackMidiMapping(index);
        ControlCollection.Instance.register(new ToggleButton(trackMapping.mute, this.track.mute()));
        ControlCollection.Instance.register(new ToggleButton(trackMapping.solo, this.track.solo()));
        ControlCollection.Instance.register(new ToggleButton(trackMapping.record, this.track.arm()));
        var clipButtons = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return new ClipButton(trackMapping.clips[index], _this.track.clipLauncherSlotBank(), index); });
        clipButtons.forEach(function (button) { return ControlCollection.Instance.register(button); });
    }
    return Track;
}());
