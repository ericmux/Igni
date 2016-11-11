import {vec2, vec4, mat4} from "gl-matrix";
import {Shader, VertexAttrInfo} from "./Shader";
import DrawCall from "./DrawCall";
import {WGLTexture} from "../../loader/TextureManager";

export class SpriteDrawCall extends DrawCall {
    public color: vec4;
    public texture: WGLTexture;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, texture : WGLTexture) {
        super (projection, view, model);

        this.color = color;
        this.texture = texture;
    }
}

export class SpriteShader extends Shader {
    
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        
        var vertex_shader = require("./glsl/sprite_vert.glsl") as string;
        var fragment_shader = require("./glsl/sprite_frag.glsl") as string;
        
        super(gl_context, vertex_shader, fragment_shader);
        
        this.targetVBO = targetVBO;

        let vertex_float_length = 4;
        let uv_float_length = 2;
        //  4 vertices, 4 float32 component each
        let uvVboDataOffset = 4 * vertex_float_length * Float32Array.BYTES_PER_ELEMENT;

        this.attrInfos = {
            "position" : <VertexAttrInfo> {
                dimension : vertex_float_length,  // dimension of each vertex attribute
                type : this.gl_context.FLOAT,
                normalized : false
            },
            "uv" : <VertexAttrInfo> {
                dimension : uv_float_length,
                type : this.gl_context.FLOAT,
                normalized : false,
                offset : uvVboDataOffset
            }
        };
    }

    public render(draw_call :SpriteDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {

        super.render(draw_call, activeShader, activeVBO);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, 4);
    }
}