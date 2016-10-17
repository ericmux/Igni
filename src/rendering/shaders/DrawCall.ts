import {vec4, mat4} from "gl-matrix";

class DrawCall {
    public modelView: mat4; // Modelview matrix of the object to render.
    public projection: mat4; // Projection matrix (only orthogonal for now).
    
    constructor (projection : mat4, modelView : mat4)
    {
        this.projection = projection;
        this.modelView = modelView;
    }
}
export default DrawCall;