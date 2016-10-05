import {RENFlatColor} from "./ren_flat_color.ts";
import {vec2} from "gl-matrix"
import {vec4} from "gl-matrix"
import {mat4} from "gl-matrix"
import {WGL} from "./wgl.ts";

export class ColorSquare {

    // load_vbo (vertices : Float32Array, color : vec4, r_type : number, vert_step : number) : void {
    position : vec2;
    width : number;
    height : number;
    color : vec4;
    render : RENFlatColor;

    constructor (render : RENFlatColor) {
        this.color = vec4.fromValues (1.0, 0.0, 0.0, 1.0);
        this.position = vec2.fromValues (0.0, 0.0);
        this.width = 50.0;
        this.height = 50.0;
        this.render = render;
    }

    vertices () : Float32Array {
        let floats : Float32Array = new Float32Array (4*4);
        let res : vec2 = vec2.create ();

        vec2.add (res, this.position, [-this.width/2.0, -this.height/2.0]);  
        floats[0] = res[0]; floats[1] = res[1]; floats[2] = 0.0; floats[3] = 1.0;

        vec2.add (res, res, [0, this.height]);  
        floats[4] = res[0]; floats[5] = res[1]; floats[6] = 0.0; floats[7] = 1.0; 

        vec2.add (res, res, [this.width, 0]);  
        floats[8] = res[0]; floats[9] = res[1]; floats[10] = 0.0; floats[11] = 1.0;

        vec2.add (res, res, [0, -this.height]);  
        floats[12] = res[0]; floats[13] = res[1]; floats[14] = 0.0; floats[15] = 1.0;

        return floats;
    }

    draw (p : mat4, mv : mat4) : void {
        this.render.load_vbo (this.vertices (), this.color, WGL.gl.TRIANGLE_FAN, 4)
        this.render.draw (p, mv);
    }
}