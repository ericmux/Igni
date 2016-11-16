import {KeyboardEvents, MouseEvents} from "./InputEvents";
import {EventInfo, KeyboardEventInfo, MouseEventInfo} from "./EventInfo";
import Shape from "../rendering/shapes/Shape";
import Body from "../physics/bodies/Body";

interface Interactable {};

interface MouseInteractable extends Interactable {
    onClick: (handler :(target :Shape | Body, event_info? :MouseEventInfo) => void) => void;
    onMouseDown: (handler :(target :Shape | Body, event_info? :MouseEventInfo) => void) => void;
    onMouseUp: (handler :(target :Shape | Body, event_info? :MouseEventInfo) => void) => void;
    onMouseMove: (handler :(target :Shape | Body, event_info? :MouseEventInfo) => void) => void;
};

interface KeyboardInteractable extends Interactable {
    onKeyDown: (handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) => void;
    onKeyUp: (handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) => void;
    onKeyPressed: (handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) => void;
};

export {Interactable, MouseInteractable, KeyboardInteractable};

