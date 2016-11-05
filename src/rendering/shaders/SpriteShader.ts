import {vec2, vec4, mat4} from "gl-matrix";
import Shader from "./Shader";
import DrawCall from "./DrawCall";
import {WGLTexture} from "../../loader/TextureManager";

export class SpriteDrawCall extends DrawCall {
    public color: vec4;
    public vertices: vec4[]; // data to draw (must have length 4).
    public uv: vec2[];
    public texture: WGLTexture;

    constructor (projection : mat4, view : mat4, model : mat4, color : vec4, vertices : vec4[], uv : vec2[], texture : WGLTexture) {
        super (projection, view, model);

        this.color = color;
        this.vertices = vertices;
        this.uv = uv;
        this.texture = texture;
    }
}

export class SpriteShader extends Shader {
    
    //  Avoid unncecesary calls that blocks GPU
    private _projectionMatrixLocation : WebGLUniformLocation;
    private _viewMatrixLocation : WebGLUniformLocation;
    private _modelMatrixLocation : WebGLUniformLocation;
    private _fColorLocation : WebGLUniformLocation;
    private _vPositionLocation : number;
    private _vTexCoordLocation : number;
    private _textureLocation : WebGLUniformLocation;

    //  Avoid unnecessary GC
    private _vertex_float_length :number;
    private _uv_float_length : number;
    private _vboData : Float32Array;
    private _uvVboDataOffset : number;
    
    constructor(gl_context: WebGLRenderingContext, targetVBO: WebGLBuffer) {
        
        var vertex_shader = require("./glsl/sprite_vert.glsl") as string;
        var fragment_shader = require("./glsl/sprite_frag.glsl") as string;
        
        super(gl_context, vertex_shader, fragment_shader);
        
        this.targetVBO = targetVBO;

        this._vertex_float_length = 4;
        this._uv_float_length = 2;
        // 4 = draw_call.vertices.length = 4
        // 4 = draw_call.uv.length
        this._vboData= new Float32Array (this._vertex_float_length*4 + this._uv_float_length*4);

        this.gl_context.useProgram(this.program);

        //  Get unifoms location
        this._projectionMatrixLocation = this.gl_context.getUniformLocation(this.program, "projectionMatrix");
        this._viewMatrixLocation = this.gl_context.getUniformLocation(this.program, "viewMatrix");
        this._modelMatrixLocation = this.gl_context.getUniformLocation(this.program, "modelMatrix");
        this._fColorLocation = this.gl_context.getUniformLocation(this.program, "fColor");
        this._textureLocation = this.gl_context.getUniformLocation(this.program, "texture")

        //  Get Attribute locations
        this._vPositionLocation = this.gl_context.getAttribLocation(this.program, "vPosition");
        this._vTexCoordLocation = this.gl_context.getAttribLocation(this.program, "vTexCoord");

        // Size in bytes where uv data begin
        // draw_call.vertices.length = 4
        this._uvVboDataOffset = 4 * this._vertex_float_length * Float32Array.BYTES_PER_ELEMENT;
    }

    public render(draw_call :SpriteDrawCall) :void {

        if (draw_call.vertices.length != draw_call.uv.length) 
            throw new Error ("Each vertex must have just one uv attribute");

        for(let i = 0; i < draw_call.vertices.length; i++) {
            this._vboData[this._vertex_float_length*i] =  draw_call.vertices[i][0];
            this._vboData[this._vertex_float_length*i + 1] =  draw_call.vertices[i][1];
            this._vboData[this._vertex_float_length*i + 2] =  draw_call.vertices[i][2];
            this._vboData[this._vertex_float_length*i + 3] =  draw_call.vertices[i][3];

            this._vboData[this._vertex_float_length*draw_call.vertices.length + this._uv_float_length*i] =  draw_call.uv[i][0];
            this._vboData[this._vertex_float_length*draw_call.vertices.length + this._uv_float_length*i + 1] =  draw_call.uv[i][1];
        }

        // Load the data into the VBO.
        this.gl_context.bufferData(this.gl_context.ARRAY_BUFFER, this._vboData, this.gl_context.STATIC_DRAW);

        // Assign uniform variables.
        this.gl_context.useProgram(this.program);
        this.gl_context.uniformMatrix4fv(this._projectionMatrixLocation, false, draw_call.projection); 
        this.gl_context.uniformMatrix4fv(this._viewMatrixLocation, false, draw_call.view);
        this.gl_context.uniformMatrix4fv(this._modelMatrixLocation, false, draw_call.model); 
        this.gl_context.uniform4fv(this._fColorLocation, draw_call.color);

        // Assigning position attributes
        this.gl_context.vertexAttribPointer(this._vPositionLocation, this._vertex_float_length, this.gl_context.FLOAT, false, 0, 0);
        this.gl_context.enableVertexAttribArray(this._vPositionLocation);

        // Enable uv texture coord pointer. 
        this.gl_context.vertexAttribPointer(this._vTexCoordLocation, this._uv_float_length, this.gl_context.FLOAT, false, 0, this._uvVboDataOffset);
        this.gl_context.enableVertexAttribArray(this._vTexCoordLocation);

        //  Use correct texture
        this.gl_context.activeTexture (this.gl_context.TEXTURE0 + draw_call.texture.imageUnit);
        this.gl_context.uniform1i(this._textureLocation, draw_call.texture.imageUnit);

        // Execute draw call.
        this.gl_context.drawArrays(this.gl_context.TRIANGLE_FAN, 0, draw_call.vertices.length);
    }
}