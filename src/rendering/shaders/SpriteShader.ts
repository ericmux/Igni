import {vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import DrawCall from "./DrawCall";

interface SpriteDrawCall extends DrawCall {
    color: vec4;
    vertices: vec4[]; // vertices to draw (must have length 4).
}

export default class SpriteShader extends Shader {
    constructor(gl_context: WebGLRenderingContext) {
        var vertex_shader = require("./glsl/sprite_vert.glsl");
        var fragment_shader = require("./glsl/sprite_frag.glsl");
        super(gl_context, vertex_shader, fragment_shader);
    }

    public render(draw_call :SpriteDrawCall) :void {}
}