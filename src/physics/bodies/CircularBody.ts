import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import Shape from "../../rendering/shapes/Shape";
import Circle from "../../rendering/shapes/Circle";
import CollisionArea from "../collision/CollisionArea";

// TO DO: Make all constructors take body definitions. BODY FACTORY.

export default class CircularBody extends Body implements CollisionArea {

    private _radius :number;

    constructor(position :vec2, radius :number) {
        super(position, 2*radius, 2*radius);
        this._radius = radius;
        this.shape = new Circle(vec3.fromValues(position[0], position[1],1.0), this._radius);
        this.momentOfInertia = 0.5 * Math.PI * Math.pow(this._radius, 4);
    }

    public center() {
        return this.position;
    }

    public contains(point :vec2) :boolean {
        return vec2.sqrLen(vec2.sub(vec2.create(), point, this.center())) <= this._radius*this._radius;
    }

}