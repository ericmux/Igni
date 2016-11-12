import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {WireQuadDrawCall} from "../shaders/debug/WireQuadShader";
import RectangleShape from "../shapes/RectangleShape";

export default class WireRectangle extends RectangleShape {
    
    private _wireQuadDrawCall : WireQuadDrawCall;

    constructor (position :vec3, width : number, height : number) {
        super(position, width, height);
        
        this._wireQuadDrawCall = new WireQuadDrawCall (null, null, null, null, null);
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
            
        this._wireQuadDrawCall.projection = projection;
        this._wireQuadDrawCall.view = view;
        this._wireQuadDrawCall.model = this.modelMatrix;
        this._wireQuadDrawCall.color = this._color;
        this._wireQuadDrawCall.lineWidth = 1;

        return this._wireQuadDrawCall;
    }
}