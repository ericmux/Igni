import {KeyboardEvents, MouseEvents} from "./InputEvents";
import Shape from "../rendering/shapes/Shape";
import Body from "../physics/bodies/Body";
import {EventInfo, KeyboardEventInfo} from "./EventInfo";
import KeyboardManager from "./KeyboardManager";

export default class InputManager {
    private _keyboardManager :KeyboardManager;

    constructor() {
        this._keyboardManager = new KeyboardManager();
    }

    public subscribeTo(event :KeyboardEvents | MouseEvents, target : Shape | Body, 
                    handler :(target :Shape | Body, event_info? :EventInfo) => void) {
        if ((event in KeyboardEvents)) {
            this._keyboardManager.subscribeTo(<KeyboardEvents>event, target, handler);
        }
    }
}