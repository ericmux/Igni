import {vec4, mat4} from "gl-matrix";
import {Shader, VertexAttrInfo} from "./Shader";
import {FlatColorShader, FlatColorDrawCall} from "./FlatColorShader";

export class LineDrawCall extends FlatColorDrawCall {
    
    constructor (projection : mat4, view : mat4, model : mat4, color : vec4) {
        super (projection, view, model, color);
    }
}

export class LineShader extends FlatColorShader {

    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        super(gl_context, targetVBO);
    }
    
    public render(draw_call: LineDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {    
        super.render(draw_call, activeShader, activeVBO);
    }
    protected renderInternal () {
        this.gl_context.drawArrays(this.gl_context.LINES, 0, 2);
    }
}