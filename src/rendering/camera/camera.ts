import {vec2, vec3, mat4, quat} from "gl-matrix";
import Shape from "../shapes/Shape";
import DrawCall from "../shaders/DrawCall";

export default class Camera extends Shape {
    private _zoomX :number;
    private _zoomY :number;

    set zoomX (newZoomX : number) {
        this._zoomX = newZoomX;
        this.scale = vec3.fromValues(this._zoomX, this._zoomY, 1);
    }

    set zoomY (newZoomY : number) {
        this._zoomY = newZoomY;
        this.scale = vec3.fromValues(this._zoomX, this._zoomY, 1);
    }

    constructor (position :vec2, zoomX :number, zoomY :number) {
        super(position);
        this.scale = vec3.fromValues(zoomX,zoomY,1);
    }

    public toDrawCall(projection: mat4, view : mat4) :DrawCall {
        return null;
    }

    public followShapeViewMatrix () : mat4 {
        return this.modelMatrix;
    }
}