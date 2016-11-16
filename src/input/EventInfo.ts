import {vec2} from "gl-matrix";
import Keys from "./Keys";

export class EventInfo {};

export class KeyboardEventInfo extends EventInfo {
    constructor(public key :Keys){
        super();
    }
}

export class MouseEventInfo extends EventInfo {
    constructor(public pos :vec2){
        super();
    }
}
