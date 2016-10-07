import {vec2, vec3, mat4} from "gl-matrix";
import DrawCall from "../shaders/DrawCall";

abstract class Shape {
    protected modelView: mat4;
    public abstract toDrawCall(projection: mat4) :DrawCall;

    public translate(v : vec2) {
        let t :vec3 = vec3.fromValues(v[0], v[1], 0.0);
        mat4.translate(this.modelView, this.modelView, t);
    }
}
export default Shape;