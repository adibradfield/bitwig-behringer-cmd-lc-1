class ControlCollection{
    static readonly Instance = new ControlCollection();

    private readonly _internalCollection : { [key: number]: Control[] } = {};

    init(){

    }

    get(midiAddress:number, status:number): Control | null{
        var possibleMatches = this._internalCollection[midiAddress];
        var match: Control | null = null;
        possibleMatches.forEach((control) => {
            if(control.registeredStatusCodes.some((statusCode) => statusCode == status)){
                match = control;
            }
        });
        return match;
    }

    register(control:Control){
        if(!Array.isArray(this._internalCollection[control.midiAddress])){
            this._internalCollection[control.midiAddress] = [];
        }

        this._internalCollection[control.midiAddress].push(control);
    }

    reset(){
        Object.keys(this._internalCollection).forEach((key) => {
            this._internalCollection[parseInt(key)].forEach((control) => control.reset());
        });
    }
}