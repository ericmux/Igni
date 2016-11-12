import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {WireCircleDrawCall} from "../shaders/debug/WireCircleShader";
import CircleShape from "../shapes/CircleShape";

export default class WireCircle extends CircleShape {
    
    private _wireCircleDrawCall : WireCircleDrawCall;

    constructor (position :vec3, radius : number) {
        super(position, radius);
        
        this._wireCircleDrawCall = new WireCircleDrawCall (null,null,null,null,null,null, null);
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
        
        this._wireCircleDrawCall.projection = projection;
        this._wireCircleDrawCall.view = view;
        this._wireCircleDrawCall.model = this.modelMatrix;
        this._wireCircleDrawCall.color = this._color;
        this._wireCircleDrawCall.center = this._centerPosition;
        this._wireCircleDrawCall.radius = this._radius;
        this._wireCircleDrawCall.innerRadius = this._radius - 1;

        return this._wireCircleDrawCall;
    }
}