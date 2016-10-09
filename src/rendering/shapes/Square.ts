import Shape from "./Shape";
import {vec2, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorDrawCall} from "../shaders/FlatColorShader";

export default class ColorSquare extends Shape {
    private position : vec2;
    private width  : number;
    private height : number;
    private color  : vec4;
    modelView: mat4;

    constructor () {
        super();
        this.color = vec4.fromValues (1.0, 0.0, 0.0, 1.0);
        this.position = vec2.fromValues (0.0, 0.0);
        this.width = 20.0;
        this.height = 20.0;
        this.modelView = mat4.create();
    }

    private calculateVertices () : vec4[] {
        let vertices :vec4[] = [];
        let res : vec2 = vec2.create ();

        vec2.add (res, this.position, [-this.width/2.0, -this.height/2.0]);  
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
        return <FlatColorDrawCall>{
            projection: projection,
            modelView: this.modelView,
            color: this.color,
            vertices: this.calculateVertices()
        };
    }
}