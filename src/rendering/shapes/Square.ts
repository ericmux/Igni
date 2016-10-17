import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorDrawCall} from "../shaders/FlatColorShader";

export default class ColorSquare extends Shape {
    private width  : number;
    private height : number;
    private color  : vec4;

    constructor (position :vec3, width : number, height : number) {
        super(position);
        this.color = vec4.fromValues (1.0, 0.0, 0.0, 1.0);
        this.width = width;
        this.height = height;
    }

    private calculateVertices () : vec4[] {
        let vertices :vec4[] = [];
        let res : vec2 = vec2.create ();

        vec2.add (res, vec2.create(), [-this.width/2.0, -this.height/2.0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, this.height]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [this.width, 0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, -this.height]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        return vertices;
    }

    public toDrawCall (projection : mat4) : DrawCall {
            return new FlatColorDrawCall (projection,
                                          this.modelMatrix,
                                          this.color,
                                          this.calculateVertices());
    }
}