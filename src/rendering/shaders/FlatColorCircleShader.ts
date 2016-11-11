import {vec4, mat4} from "gl-matrix";
import {Shader, VertexAttrInfo} from "./Shader";
import {FlatColorDrawCall} from "./FlatColorShader";

export class FlatColorCircleDrawCall extends FlatColorDrawCall {
    center: vec4;
    radius: number;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, center : vec4, radius : number) {
        super (projection, view, model, color);

        this.center = center;
        this.radius = radius;
    }
}

export class FlatColorCircleShader extends Shader {
    
    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        
        var vertex_shader = require("./glsl/flat_color_circle_vert.glsl") as string;
        var fragment_shader = require("./glsl/flat_color_circle_frag.glsl") as string;
        
        super(gl_context, vertex_shader, fragment_shader);

        this.targetVBO = targetVBO;

        let vertex_float_length = 4;

        this.attrInfos = {
            "position" : <VertexAttrInfo> {
                dimension : vertex_float_length,  // dimension of each vertex attribute
                type : this.gl_context.FLOAT,
                normalized : false
            }
        };
    }

    public render(draw_call: FlatColorCircleDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {
        super.render(draw_call, activeShader, activeVBO);
    }

    protected renderInternal () {
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, 4);
    }
}