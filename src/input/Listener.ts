import Shape from "../rendering/shapes/Shape";
import Body from "../physics/bodies/Body";
import {EventInfo} from "./EventInfo";

export default class Listener {
    constructor(public target : Shape | Body, 
                public handler : (target :Shape | Body, event_info? :EventInfo) => void) {}
}