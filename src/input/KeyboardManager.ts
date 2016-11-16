import {KeyboardEvents} from "./InputEvents";
import Keys from "./Keys";
import Listener from "./Listener";
import Shape from "../rendering/shapes/Shape";
import Body from "../physics/bodies/Body";
import {EventInfo, KeyboardEventInfo} from "./EventInfo";

export default class KeyboardManager {

    private _handlers :{[event :number] :Listener[]};

    constructor() {
        this._handlers = {};

        window.addEventListener('keydown', (ev: KeyboardEvent) => {
            let key_code :number = ev.keyCode;
            let event_info :KeyboardEventInfo = new KeyboardEventInfo(key_code);
            this.emit(KeyboardEvents.KEYDOWN, event_info);
        });

        window.addEventListener('keyup', (ev: KeyboardEvent) => {
            let key_code :number = ev.keyCode;
            let event_info :KeyboardEventInfo = new KeyboardEventInfo(key_code);
            this.emit(KeyboardEvents.KEYUP, event_info);
        });

        window.addEventListener('keypress', (ev: KeyboardEvent) => {
            let key_code :number = ev.keyCode;
            let event_info :KeyboardEventInfo = new KeyboardEventInfo(key_code);
            this.emit(KeyboardEvents.KEYPRESS, event_info);
        });
    }

    public subscribeTo(event :KeyboardEvents, target : Shape | Body, handler :(target :Shape | Body, event_info? :EventInfo) => void) {
        if(!(event in this._handlers)) {
            this._handlers[event] = [];
        }
        let listener_exists :boolean = false;
        this._handlers[event].forEach((listener :Listener) => {
            if(listener.target !== target) return;

            // User is redefining the handler, use the new one.
            listener.handler = handler;
            listener_exists = true;
        });
        if(listener_exists) return;

        // Add the new listener.
        let listener :Listener = new Listener(target, handler);
        this._handlers[event].push(listener);
    }

    private emit(event :KeyboardEvents, event_info? :KeyboardEventInfo) {
        if(!(event in this._handlers)) return;

        this._handlers[event].forEach((listener :Listener) => {
            listener.handler(listener.target, event_info);
        });
    }
};