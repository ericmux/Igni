import {vec4, mat4} from "gl-matrix";

class DrawCall {
    public modelView: mat4; // Modelview matrix of the object to render.
    public projection: mat4; // Projection matrix (only orthogonal for now).
    
    constructor (modelView : mat4, projection : mat4)
    {
        this.modelView = modelView;
        this.projection = projection;
    }
}
export default DrawCall;