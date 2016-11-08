import {vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import {FlatColorDrawCall} from "./FlatColorShader";

export class FlatColorCircleDrawCall extends FlatColorDrawCall {
    center: vec4;
    radius: number;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, vertices : vec4[], center : vec4, radius : number) {
        super (projection, view, model, color, vertices);

        this.center = center;
        this.radius = radius;
    }
}

export class FlatColorCircleShader extends Shader {
    
    //  Avoid unncecesary calls that blocks GPU
    private _projectionMatrixLocation : WebGLUniformLocation;
    private _viewMatrixLocation : WebGLUniformLocation;
    private _modelMatrixLocation : WebGLUniformLocation;
    private _fColorLocation : WebGLUniformLocation;
    private _centerLocation : WebGLUniformLocation;
    private _radiusLocation : WebGLUniformLocation;
    private _vPositionLocation : number;

    //  Avoid unnecessary GC
    private _vertex_float_length :number;
    private _vboData : Float32Array;
    
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        
        var vertex_shader = require("./glsl/flat_color_circle_vert.glsl") as string;
        var fragment_shader = require("./glsl/flat_color_circle_frag.glsl") as string;
        
        super(gl_context, vertex_shader, fragment_shader);
        
        this.targetVBO = targetVBO;

        this._vertex_float_length = 4;
        // 4 = draw_call.vertices.length = 4
        this._vboData= new Float32Array (this._vertex_float_length*4);

        this.gl_context.useProgram(this.program);

        //  Get unifoms location
        this._projectionMatrixLocation = this.gl_context.getUniformLocation(this.program, "projectionMatrix");
        this._viewMatrixLocation = this.gl_context.getUniformLocation(this.program, "viewMatrix");
        this._modelMatrixLocation = this.gl_context.getUniformLocation(this.program, "modelMatrix");
        this._fColorLocation = this.gl_context.getUniformLocation(this.program, "fColor");
        this._centerLocation = this.gl_context.getUniformLocation(this.program, "center");
        this._radiusLocation = this.gl_context.getUniformLocation(this.program, "radius");

        //  Get attribute locations
        this._vPositionLocation = this.gl_context.getAttribLocation(this.program, "vPosition");
    }

    public render(draw_call: FlatColorCircleDrawCall): void {
        
        for(let i = 0; i < draw_call.vertices.length; i++) {
            this._vboData[this._vertex_float_length*i] =  draw_call.vertices[i][0];
            this._vboData[this._vertex_float_length*i + 1] =  draw_call.vertices[i][1];
            this._vboData[this._vertex_float_length*i + 2] =  draw_call.vertices[i][2];
            this._vboData[this._vertex_float_length*i + 3] =  draw_call.vertices[i][3];
        }
        // Load the data into the VBO.
        this.gl_context.bufferData(this.gl_context.ARRAY_BUFFER, this._vboData, this.gl_context.STATIC_DRAW);

        // Assign uniform variables.
        this.gl_context.useProgram(this.program);
        this.gl_context.uniformMatrix4fv(this._projectionMatrixLocation, false, draw_call.projection); 
        this.gl_context.uniformMatrix4fv(this._viewMatrixLocation, false, draw_call.view);
        this.gl_context.uniformMatrix4fv(this._modelMatrixLocation, false, draw_call.model); 
        this.gl_context.uniform4fv(this._fColorLocation, draw_call.color);
        this.gl_context.uniform4fv(this._centerLocation, draw_call.center);
        this.gl_context.uniform1f(this._radiusLocation, draw_call.radius);

        // Assigning position attributes
        this.gl_context.vertexAttribPointer(this._vPositionLocation, this._vertex_float_length, this.gl_context.FLOAT, false, 0, 0);
        this.gl_context.enableVertexAttribArray(this._vPositionLocation);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);
    }
}