import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import Shape from "../../rendering/shapes/Shape";
import Circle from "../../rendering/shapes/Circle";

// TO DO: Make all constructors take body definitions.

export default class CircularBody extends Body {

    private _radius :number;

    constructor(position :vec2, radius :number) {
        super(position, 2*radius, 2*radius);
        this._radius = radius;
        this.shape = new Circle(vec3.fromValues(position[0], position[1],1.0), this._radius);
    }

}