import {vec4, mat4} from "gl-matrix";
import {Shader, VertexAttrInfo} from "./Shader";
import DrawCall from "./DrawCall";

export class FlatColorDrawCall extends DrawCall {
    public color: vec4;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4) {
        super (projection, view, model);

        this.color = color;
    }
}

export class FlatColorShader extends Shader {

    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        
        var vertex_shader = require("./glsl/flat_color_vert.glsl") as string;
        var fragment_shader = require("./glsl/flat_color_frag.glsl") as string;
        
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

    public render(draw_call: FlatColorDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {

        super.render(draw_call, activeShader, activeVBO);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, 4);
    }
}