import {vec2} from "gl-matrix";
import CollisionArea from "../collision/CollisionArea";

export default class Body {
    // Incremented every time a new body is created.
    public static nextID :number = 0;

    private id :number;
    public position :vec2;
    public velocity :vec2;
    public acceleration :vec2;
    public oldPosition :vec2;
    public oldVelocity :vec2;
    public angle :number;
    public angularVelocity :number;
    public collisionArea :CollisionArea;
    public torque :number;
    public mass :number;
    public momentOfInertia :number;
    public restitutionCoefficient :number;
    public width :number;
    public height :number;

    constructor(position :vec2, width :number, height :number) {
        this.id = Body.nextID++;
        this.position = vec2.clone(position);
        this.width = width;
        this.height = height;
        this.angle = 0;
    }

    

}