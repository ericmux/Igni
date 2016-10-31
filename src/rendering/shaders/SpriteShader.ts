import {vec2, vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import DrawCall from "./DrawCall";

export class SpriteDrawCall extends DrawCall {
    public color: vec4;
    public vertices: vec4[]; // data to draw (must have length 4).
    public uv: vec2[];
    public texture: WebGLTexture;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, vertices : vec4[], uv : vec2[], texture : WebGLTexture) {
        super (projection, view, model);

        this.color = color;
        this.vertices = vertices;
        this.uv = uv;
        this.texture = texture;
    }
}

export class SpriteShader extends Shader {
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        var vertex_shader = require("./glsl/sprite_vert.glsl");
        var fragment_shader = require("./glsl/sprite_frag.glsl");
        super(gl_context, vertex_shader, fragment_shader);
        this.targetVBO = targetVBO;
    }

    public render(draw_call :SpriteDrawCall) :void {
        // Load the data into the VBO.
        let vertex_float_length :number = 4;
        let uv_float_length :number = 2;
        let data : Float32Array = new Float32Array (vertex_float_length*draw_call.vertices.length + uv_float_length*draw_call.uv.length);
        for(let i = 0; i < draw_call.vertices.length; i++) {
            data[vertex_float_length*i] =  draw_call.vertices[i][0];
            data[vertex_float_length*i + 1] =  draw_call.vertices[i][1];
            data[vertex_float_length*i + 2] =  draw_call.vertices[i][2];
            data[vertex_float_length*i + 3] =  draw_call.vertices[i][3];
        }
        for(let i = draw_call.vertices.length; i < draw_call.uv.length; i++) {
            data[uv_float_length*i] =  draw_call.uv[i][0];
            data[uv_float_length*i + 1] =  draw_call.uv[i][1];
        }
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.targetVBO);
        this.gl_context.bufferData(this.gl_context.ARRAY_BUFFER, data, this.gl_context.STATIC_DRAW);

        // Assign uniform variables.
        this.gl_context.useProgram(this.program);
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "projectionMatrix"), false, draw_call.projection); 
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "viewMatrix"), false, draw_call.view);
        this.gl_context.uniformMatrix4fv(this.gl_context.getUniformLocation(this.program, "modelMatrix"), false, draw_call.model); 
        this.gl_context.uniform4fv(this.gl_context.getUniformLocation(this.program, "fColor"), draw_call.color);

        //  Bind VBO
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.targetVBO);

        // Assigning position attribute.
        let stride = vertex_float_length * Float32Array.BYTES_PER_ELEMENT;  //  size in bytes between consecutives attributes
        let offset = 0;

        var vPosition = this.gl_context.getAttribLocation(this.program, "vPosition");
        this.gl_context.vertexAttribPointer(vPosition, vertex_float_length, this.gl_context.FLOAT, false, stride, offset);
        this.gl_context.enableVertexAttribArray(vPosition);

        // Assigning uv texture coordinates.
        stride = uv_float_length * Float32Array.BYTES_PER_ELEMENT;
        offset = draw_call.vertices.length * vertex_float_length * Float32Array.BYTES_PER_ELEMENT; // siez in bytes where to begin 

        var vTexCoord = this.gl_context.getAttribLocation(this.program, "vTexCoord");
        this.gl_context.vertexAttribPointer(vTexCoord, uv_float_length, this.gl_context.FLOAT, false, stride, offset);
        this.gl_context.enableVertexAttribArray(vTexCoord);

        //  Bind Texture
        this.gl_context.activeTexture(this.gl_context.TEXTURE0);
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, draw_call.texture);
        this.gl_context.uniform1i(this.gl_context.getUniformLocation(this.program, "texture"), 0);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);
    }
}