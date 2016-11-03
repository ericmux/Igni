import {vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import DrawCall from "./DrawCall";

export class FlatColorDrawCall extends DrawCall {
    public color: vec4;
    public vertices: vec4[]; // vertices to draw (must have length 4).

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, vertices : vec4[]) {
        super (projection, view, model);

        this.color = color;
        this.vertices = vertices;
    }
}

export class FlatColorShader extends Shader {
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        var vertex_shader = require("./glsl/flat_color_vert.glsl") as string;
        var fragment_shader = require("./glsl/flat_color_frag.glsl") as string;
        super(gl_context, vertex_shader, fragment_shader);
        this.targetVBO = targetVBO;
    }

    public render(draw_call: FlatColorDrawCall): void {
        // Load the data into the VBO.
        let floats_per_vertex :number = 4;
        let vertices : Float32Array = new Float32Array (floats_per_vertex*draw_call.vertices.length);
        for(let i = 0; i < draw_call.vertices.length; i++) {
            vertices[floats_per_vertex*i] =  draw_call.vertices[i][0];
            vertices[floats_per_vertex*i + 1] =  draw_call.vertices[i][1];
            vertices[floats_per_vertex*i + 2] =  draw_call.vertices[i][2];
            vertices[floats_per_vertex*i + 3] =  draw_call.vertices[i][3];
        }
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.targetVBO);
        this.gl_context.bufferData(this.gl_context.ARRAY_BUFFER, vertices, this.gl_context.STATIC_DRAW);

        // Assign uniform variables.
        this.gl_context.useProgram(this.program);
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "projectionMatrix"), false, draw_call.projection); 
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "viewMatrix"), false, draw_call.view);
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "modelMatrix"), false, draw_call.model); 
        this.gl_context.uniform4fv(this.gl_context.getUniformLocation(this.program, "fColor"), draw_call.color);

        // Assigning attributes.
        var vPosition = this.gl_context.getAttribLocation(this.program, "vPosition");
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.targetVBO);
        this.gl_context.vertexAttribPointer(vPosition, floats_per_vertex, this.gl_context.FLOAT, false, 0, 0);
        this.gl_context.enableVertexAttribArray(vPosition);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);
    }
}