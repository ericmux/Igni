import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import Shape from "../../rendering/shapes/Shape";
import Square from "../../rendering/shapes/Square";
import CollisionArea from "../collision/CollisionArea";

// TO DO: Make all constructors take body definitions. BODY FACTORY.

export default class RectangularBody extends Body implements CollisionArea {

    constructor(position :vec2, width :number, height :number) {
        super(position, width, height);
        this.shape = new Square(vec3.fromValues(position[0], position[1],1.0), width, height);
        this.momentOfInertia = (this.mass / 12) * (this.height*this.height + this.width*this.width);
    }

    public center() {
        return this.position;
    }

    public contains(point :vec2) :boolean {
        return (point[0] >= this.position[0] - this.width/2 && 
                point[0] <= this.position[0] + this.width/2 && 
                point[1] >= this.position[1] - this.height/2 && 
                point[1] <= this.position[1] + this.height/2);
    }

}