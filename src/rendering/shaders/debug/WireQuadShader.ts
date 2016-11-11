import {FlatColorShader, FlatColorDrawCall} from "../FlatColorShader";
import {vec4, mat4} from "gl-matrix";
import {Shader} from "../Shader";

export class WireQuadDrawCall extends FlatColorDrawCall {
    public lineWidth : number;

        constructor (projection : mat4, view : mat4, model : mat4, color : vec4, lineWidth : number) {
        super (projection, view, model, color);

        this.lineWidth = lineWidth;
    }
}

export class WireQuadShader extends FlatColorShader {

    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        super (gl_context, targetVBO);
    }

    public render(draw_call: WireQuadDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {
        
        this.gl_context.lineWidth (draw_call.lineWidth);

        super.render (draw_call, activeShader, activeVBO);
    }

    protected renderInternal () {
        this.gl_context.drawArrays(this.gl_context.LINE_LOOP, 0, 4);
    }
}