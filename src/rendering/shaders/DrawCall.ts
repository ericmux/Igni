import {vec4, mat4} from "gl-matrix";

class DrawCall {
    public model: mat4; // Modelview matrix of the object to render.
    public view : mat4;
    public projection: mat4; // Projection matrix (only orthogonal for now).

    constructor (projection : mat4, view : mat4, model : mat4)
    {
        this.projection = projection;
        this.view = view;
        this.model = model;
    }
}
export default DrawCall;