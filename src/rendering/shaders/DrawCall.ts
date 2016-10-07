import {vec4, mat4} from "gl-matrix";

interface DrawCall {
    modelView: mat4; // Modelview matrix of the object to render.
    projection: mat4; // Projection matrix (only orthogonal for now).
}
export default DrawCall;