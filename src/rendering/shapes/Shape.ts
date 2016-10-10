import {vec2, vec3, mat4} from "gl-matrix";
import DrawCall from "../shaders/DrawCall";

abstract class Shape {
    protected modelView: mat4;
    protected position : vec2;
    protected updateCallback: (shape :Shape) => void;
    public abstract toDrawCall(projection: mat4) :DrawCall;

    constructor(position :vec2) {
        this.position = position;
        let translation : vec3 = vec3.fromValues(position[0], position[1], 0.0);
        this.modelView = mat4.create();
        this.modelView = mat4.translate(this.modelView, this.modelView, translation);
    }

    public translate(v : vec2) {
        let t :vec3 = vec3.fromValues(v[0], v[1], 0.0);
        mat4.translate(this.modelView, this.modelView, t);
    }

    public update() {
        this.updateCallback(this);
    }

    public onUpdate(updateCallback :(shape :Shape) => void) {
        this.updateCallback = updateCallback;
    }
}
export default Shape;