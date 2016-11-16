import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {LineDrawCall} from "../shaders/LineShader";

export default class LineShape extends Shape {
    
    protected _color  : vec4;
    private _lineDrawCall : LineDrawCall;

    constructor (begin : vec2, end : vec2, color? : vec4) {
        
        super(begin);

        this.setLine (begin, end, color);

        this._lineDrawCall = new LineDrawCall (null, null, null, null);
    }

    public setLine (begin : vec2, end : vec2, color? : vec4) {
        
        let length = vec2.distance (begin, end); 
        let rotation : number;

        if (begin[0] === end[0]) {

            //  If degenerated LineShape
            if (begin[1] === end[1]){
                rotation = 0;
            }
            //  If vertical line
            {
                rotation = (Math.PI / 2) * Math.abs (end[1] - begin[1]) / (end[1] - begin[1]);
            }
        }
        else {
            rotation = Math.atan2(end[1] - begin[1], end[0] - begin[0]);
        }

        this._color = color || this._color || vec4.fromValues (1.0, 1.0, 1.0, 1.0);
        this.setPosition (begin);  
        this.setRotation (rotation);
        this.setScale (vec2.fromValues (length, 1));
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
            
        this._lineDrawCall.projection = projection;
        this._lineDrawCall.view = view;
        this._lineDrawCall.model = this.modelMatrix;
        this._lineDrawCall.color = this._color;

        return this._lineDrawCall;
    }

}