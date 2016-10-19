import {vec2, vec3, mat4, quat} from "gl-matrix";

export default class Camera {

    protected position : vec3;
    protected rotation : number;
    protected scale : number;

    private _heightPx : number;
    set heightPx (px : number) {
        this._heightPx = px;
        this.scale = this._heightPx / this._orthoSize / 2;
    }

    private _orthoSize : number;
    set orthoSize (value : number) {
        this._orthoSize = value;
        this.scale = this._heightPx / this._orthoSize / 2;
    }
    get orthoSize () : number {
        return this._orthoSize;
    }

    private _viewMatrix : mat4;
    get viewMatrix () : mat4 {
        this.updateViewMatrix ();
        return this._viewMatrix;
    }

    constructor (height : number) {
        this.position = vec3.create ();
        this.rotation = 0;
        
        this._orthoSize = 8;
        this._heightPx = height;
        this.scale = this._heightPx / this._orthoSize / 2;
        
        this._viewMatrix = mat4.create ();
    }

    private updateViewMatrix () {
        let q : quat = quat.create ();
        quat.setAxisAngle (q, [0,0,1], this.rotation);

        this._viewMatrix = mat4.fromRotationTranslationScale (this._viewMatrix,
            q, this.position, vec3.fromValues (this.scale, this.scale, 1));
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
}