import {vec4, mat4} from "gl-matrix";
import {Shader, VertexAttrInfo} from "../Shader";
import {FlatColorCircleShader, FlatColorCircleDrawCall} from "../FlatColorCircleShader";

export class WireCircleDrawCall  extends FlatColorCircleDrawCall {

    public innerRadius : number;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, center : vec4, radius : number, innerRadius : number) {
        super (projection, view, model, color, center, radius);

        this.innerRadius = innerRadius;
    }
}

export class WireCircleShader extends Shader {
    
    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        
        var vertex_shader = require("../glsl/wire_circle_vert.glsl") as string;
        var fragment_shader = require("../glsl/wire_circle_frag.glsl") as string;
        
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

    public render(draw_call: WireCircleDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {
        super.render(draw_call, activeShader, activeVBO);
    }

    protected renderInternal () {
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, 4);
    }
}