import {vec2, vec3, mat4, quat} from "gl-matrix";
import {DrawCall, Renderable} from "../shaders/DrawCall";

abstract class Shape implements Renderable {
    public abstract toDrawCall(projection: mat4, view : mat4) :DrawCall;

    private _modelMatrix: mat4;
    private _invModelMatrix: mat4;
    private _size : vec3;
    protected position : vec3; 
    protected rotation : number;
    protected scale : vec3;
    protected updateCallback: (shape : Shape, deltaTime : number) => void;

    constructor(position :vec3, size? : vec3) {
        this.position = position;
        this.rotation = 0;
        this._size = size || vec3.fromValues (1,1,1);
        this.scale = vec3.fromValues (1,1,1);
        this._modelMatrix = mat4.create();
        this._invModelMatrix = mat4.invert(mat4.create(), this._modelMatrix);
    }

    public update(deltaTime : number) {
        this.updateCallback(this, deltaTime);
    }

    public onUpdate(updateCallback :(shape :Shape, deltaTime : number) => void) {
        this.updateCallback = updateCallback;
    }

    public translate(v : vec2) {
        vec3.add(this.position, this.position, vec3.fromValues(v[0], v[1], 0));
    }

    /**
     * Rotate around z axis angle degrees
     * @param angle angle degrees
     */
    public rotate (angle : number) {
        this.rotation += angle;
    }

    /**
     * Set shape scale in x and y dimensions
     */
    public setScale (s : vec2) {
        this.scale = vec3.fromValues(s[0], s[1], 1);
    }

    public setPosition(newPos : vec2) {
        this.position = vec3.fromValues(newPos[0], newPos[1], 0);
    }

    public setRotation(angle : number) {
        this.rotation = angle;
    }

    protected updateModelMatrix () {
        let q : quat = quat.create ();
        quat.setAxisAngle (q, [0,0,1], this.rotation);

        let s = vec3.fromValues (this._size[0] * this.scale[0], this._size[1] * this.scale[1], 1);

        this._modelMatrix = mat4.fromRotationTranslationScale (this._modelMatrix,
            q, this.position, s);
    }

    get modelMatrix () : mat4 {
        this.updateModelMatrix();
        return this._modelMatrix;
    }

    // A matrix which sets the camera reference to this shape's object coordinates.
    public followShapeViewMatrix () : mat4 {
        this.updateModelMatrix();
        mat4.invert(this._invModelMatrix, this._modelMatrix);
        return this._invModelMatrix;    
    }
}
export default Shape;