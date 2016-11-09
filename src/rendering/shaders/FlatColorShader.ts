import {vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import DrawCall from "./DrawCall";

export class FlatColorDrawCall extends DrawCall {
    public color: vec4;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4) {
        super (projection, view, model);

        this.color = color;
    }
}

export class FlatColorShader extends Shader {
    
    //  Avoid unncecesary calls that blocks GPU
    private _projectionMatrixLocation : WebGLUniformLocation;
    private _viewMatrixLocation : WebGLUniformLocation;
    private _modelMatrixLocation : WebGLUniformLocation;
    private _fColorLocation : WebGLUniformLocation;
    private _vPositionLocation : number;
    
    //  Avoid unnecessary GC
    private _vertex_float_length :number;

    constructor(gl_context: WebGLRenderingContext, targetVBO : WebGLBuffer) {
        
        var vertex_shader = require("./glsl/flat_color_vert.glsl") as string;
        var fragment_shader = require("./glsl/flat_color_frag.glsl") as string;
        
        super(gl_context, vertex_shader, fragment_shader);

        this.targetVBO = targetVBO;

        this._vertex_float_length = 4;

        this.gl_context.useProgram(this.program);

        //  Get unifoms location
        this._projectionMatrixLocation = this.gl_context.getUniformLocation(this.program, "projectionMatrix");
        this._viewMatrixLocation = this.gl_context.getUniformLocation(this.program, "viewMatrix");
        this._modelMatrixLocation = this.gl_context.getUniformLocation(this.program, "modelMatrix");
        this._fColorLocation = this.gl_context.getUniformLocation(this.program, "fColor");

        //  Get attribute locations
        this._vPositionLocation = this.gl_context.getAttribLocation(this.program, "vPosition");
    }

    public render(draw_call: FlatColorDrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {

        super.render(draw_call, activeShader, activeVBO);

        // Assign uniform variables.
        this.gl_context.uniformMatrix4fv(this._projectionMatrixLocation, false, draw_call.projection); 
        this.gl_context.uniformMatrix4fv(this._viewMatrixLocation, false, draw_call.view);
        this.gl_context.uniformMatrix4fv(this._modelMatrixLocation, false, draw_call.model); 
        this.gl_context.uniform4fv(this._fColorLocation, draw_call.color);

        // Assigning position attributes
        this.gl_context.vertexAttribPointer(this._vPositionLocation, this._vertex_float_length, this.gl_context.FLOAT, false, 0, 0);
        this.gl_context.enableVertexAttribArray(this._vPositionLocation);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, 4);
    }
}