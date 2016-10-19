import {vec2, vec3, mat4, quat} from "gl-matrix";
import DrawCall from "../shaders/DrawCall";

abstract class Shape {
    public abstract toDrawCall(projection: mat4, view : mat4) :DrawCall;

    private _modelMatrix: mat4;
    protected position : vec3;
    protected rotation : number;
    protected scale : vec3;
    protected updateCallback: (shape : Shape, deltaTime : number) => void;

    constructor(position :vec3) {
        this.position = position;
        this.rotation = 0;
        this.scale = vec3.fromValues (1,1,1);
        this._modelMatrix = mat4.create();
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

    protected updateModelMatrix () {
        let q : quat = quat.create ();
        quat.setAxisAngle (q, [0,0,1], this.rotation);

        this._modelMatrix = mat4.fromRotationTranslationScale (this._modelMatrix,
            q, this.position, this.scale);
    }

    get modelMatrix () : mat4 {
        this.updateModelMatrix();
        return this._modelMatrix;
    }
}
export default Shape;