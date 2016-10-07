import Shader from "./Shader";

// Import glsl code.
import vertex_shader = require("./glsl/flat_color_vert.glsl");
import fragment_shader = require("./glsl/flat_color_frag.glsl");

export default class FlatColorShader implements Shader {
    constructor(){
        this.vertex_shader = vertex_shader;
        this.fragment_shader = fragment_shader;
    }
}