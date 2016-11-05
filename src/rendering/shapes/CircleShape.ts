import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorCircleDrawCall} from "../shaders/FlatColorCircleShader";

export default class CircleShape extends Shape {
    
    private _centerPosition : vec4;
    private _radius : number;
    private _color  : vec4;
    private _flatColorCircleDrawCall : FlatColorCircleDrawCall;

    constructor (position :vec3, radius : number) {
        super(position);
        
        this._color = vec4.fromValues (0.0, 0.0, 1.0, 1.0);
        this._radius = radius;
        this._centerPosition = vec4.fromValues (this.position[0], this.position[1], 0, 1);
        this._flatColorCircleDrawCall = new FlatColorCircleDrawCall (null,null,null,null,null,null,null);
    }

    private calculateVertices () : vec4[] {
        let vertices :vec4[] = [];
        let res : vec2 = vec2.create ();

        vec2.add (res, vec2.create(), [-this._radius, -this._radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, 2 * this._radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [2 * this._radius, 0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, -2 * this._radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        return vertices;
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
        
        this._flatColorCircleDrawCall.projection = projection;
        this._flatColorCircleDrawCall.view = view;
        this._flatColorCircleDrawCall.model = this.modelMatrix;
        this._flatColorCircleDrawCall.color = this._color;
        this._flatColorCircleDrawCall.vertices = this.calculateVertices();
        this._flatColorCircleDrawCall.center = this._centerPosition;
        this._flatColorCircleDrawCall.radius = this._radius;

        return this._flatColorCircleDrawCall;
    }
}