import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {WireCircleDrawCall} from "../shaders/debug/WireCircleShader";

export default class WireCircle extends Shape {
    
    private _centerPosition : vec4;
    private _radius : number;
    private _color  : vec4;
    private _wireCircleDrawCall : WireCircleDrawCall;

    constructor (position :vec3, radius : number) {
        super(position, vec3.fromValues (radius, radius, 1));
        
        this._color = vec4.fromValues (0.0, 0.0, 1.0, 1.0);
        this._radius = radius;
        this._centerPosition = vec4.fromValues (this.position[0], this.position[1], 0, 1);
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

    get color () :vec4 {
        return this._color;
    }

    set color (color :vec4) {
        this._color = color;
    }
}