import {vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import {FlatColorDrawCall} from "./FlatColorShader";

export class FlatColorCircleDrawCall extends FlatColorDrawCall {
    center: vec4;
    radius: number;

    constructor (projection : mat4, modelView : mat4, color : vec4, vertices : vec4[], center : vec4, radius : number) {
        super (projection, modelView, color, vertices);

        this.center = center;
        this.radius = radius;
    }
}

export class FlatColorCircleShader extends Shader {
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        var vertex_shader = require("./glsl/flat_color_circle_vert.glsl");
        var fragment_shader = require("./glsl/flat_color_circle_frag.glsl");
        super(gl_context, vertex_shader, fragment_shader);
        this.targetVBO = targetVBO;
    }

    public render(draw_call: FlatColorCircleDrawCall): void {
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
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "modelViewMatrix"), false, draw_call.modelView); 
        this.gl_context.uniform4fv(this.gl_context.getUniformLocation(this.program, "fColor"), draw_call.color);
        this.gl_context.uniform4fv(this.gl_context.getUniformLocation(this.program, "center"), draw_call.center);
        this.gl_context.uniform1f(this.gl_context.getUniformLocation(this.program, "radius"), draw_call.radius);

        // Assigning attributes.
        var vPosition = this.gl_context.getAttribLocation(this.program, "vPosition");
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.targetVBO);
        this.gl_context.vertexAttribPointer(vPosition, floats_per_vertex, this.gl_context.FLOAT, false, 0, 0);
        this.gl_context.enableVertexAttribArray(vPosition);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);
    }
}