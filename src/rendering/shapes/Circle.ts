import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorCircleDrawCall} from "../shaders/FlatColorCircleShader";

export default class Circle extends Shape {
    private radius : number;
    private color  : vec4;

    constructor (position :vec3, radius : number) {
        super(position);
        this.color = vec4.fromValues (0.0, 0.0, 1.0, 1.0);
        this.radius = radius;
    }

    private calculateVertices () : vec4[] {
        let vertices :vec4[] = [];
        let res : vec2 = vec2.create ();

        vec2.add (res, vec2.create(), [-this.radius, -this.radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, 2 * this.radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [2 * this.radius, 0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, -2 * this.radius]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        return vertices;
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
        return new FlatColorCircleDrawCall (projection,
                                            view,
                                            this.modelMatrix,
                                            this.color,
                                            this.calculateVertices(),
                                            vec4.fromValues (this.position[0], this.position[1], 0, 1),
                                            this.radius);
    }
}