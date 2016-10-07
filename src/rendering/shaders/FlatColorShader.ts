import Shader from "./Shader";

export default class FlatColorShader extends Shader {
    constructor(gl_context: WebGLRenderingContext){
        var vertex_shader = require("./glsl/flat_color_vert.glsl");
        var fragment_shader = require("./glsl/flat_color_frag.glsl");
        super(gl_context, vertex_shader, fragment_shader);
    }
}