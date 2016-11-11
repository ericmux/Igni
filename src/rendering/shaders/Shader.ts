import {vec4, mat4} from "gl-matrix";
import DrawCall from "./DrawCall";
import {WGLTexture} from "../../loader/TextureManager";

export interface VertexAttrInfo {
    dimension : number,
    type : number,
    normalized : boolean,
    stride : number,
    offset : number
}

export abstract class Shader {
    protected vertex_shader: WebGLShader;
    protected fragment_shader: WebGLShader;
    protected program: WebGLProgram;
    protected targetVBO: WebGLBuffer;

    protected attrInfos : {[attributeName : string] : VertexAttrInfo};

    protected attributesSetters : {[name : string] : (info : VertexAttrInfo) => void} ;
    protected uniformSetters : {[name : string] : (param : mat4 | vec4 | number | WGLTexture) => void};
    protected attributesNames : string[];
    protected uniformsNames : string[];

    constructor(protected gl_context: WebGLRenderingContext, vertex_shader_source: string, fragment_shader_source: string) {
        // Load and compile vertex shader.
        this.vertex_shader = this.gl_context.createShader(this.gl_context.VERTEX_SHADER);
        this.gl_context.shaderSource(this.vertex_shader, vertex_shader_source);
        this.gl_context.compileShader(this.vertex_shader);
        if (!this.gl_context.getShaderParameter(this.vertex_shader, this.gl_context.COMPILE_STATUS)) {
            let msg = "Vertex shader failed to compile.  The error log is:"
                + "<pre>" + this.gl_context.getShaderInfoLog(this.vertex_shader) + "</pre>";
            throw new Error(msg);
        }

        // Load and compile fragment shader.
        this.fragment_shader = this.gl_context.createShader(this.gl_context.FRAGMENT_SHADER);
        this.gl_context.shaderSource(this.fragment_shader, fragment_shader_source);
        this.gl_context.compileShader(this.fragment_shader);
        if (!this.gl_context.getShaderParameter(this.fragment_shader, this.gl_context.COMPILE_STATUS)) {
            let msg = "Fragment shader failed to compile.  The error log is:"
                + "<pre>" + this.gl_context.getShaderInfoLog(this.fragment_shader) + "</pre>";
            throw new Error(msg);
        }

        // Link program
        this.program = this.gl_context.createProgram();
        this.gl_context.attachShader(this.program, this.vertex_shader);
        this.gl_context.attachShader(this.program, this.fragment_shader);
        this.gl_context.linkProgram(this.program);

        if (!this.gl_context.getProgramParameter(this.program, this.gl_context.LINK_STATUS)) {
            var msg = "Shader program failed to link.  The error log is:"
                + "<pre>" + this.gl_context.getProgramInfoLog(this.program) + "</pre>";
            throw new Error(msg);
        }

        //  Get uniforms and attributes info
        this.uniformSetters = {};
        this.attributesSetters = {};
        this.uniformsNames = [];
        this.attributesNames = [];

        this.gl_context.useProgram(this.program);

        let uniforms = this.gl_context.getProgramParameter (this.program, this.gl_context.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniforms; ++i) {
            let info = this.gl_context.getActiveUniform (this.program, i);
            let location = this.gl_context.getUniformLocation (this.program, info.name);
            
            this.uniformSetters[info.name] = this.getUniformSetter (info.type, location);
        }

        let attributes = this.gl_context.getProgramParameter (this.program, this.gl_context.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributes; ++i) {
            let info = this.gl_context.getActiveAttrib (this.program, i);
            let index = this.gl_context.getAttribLocation (this.program, info.name);
            
            this.attributesSetters[info.name] = this.getAttributeSetter (index);
        }

        this.uniformsNames = Object.keys (this.uniformSetters);
        this.attributesNames = Object.keys (this.attributesSetters);
    }

    protected getUniformSetter (type : number, location : WebGLUniformLocation) : (param : mat4 | vec4 | number | WGLTexture) => void {
        if (type ==  this.gl_context.FLOAT_MAT4) {
            return (m : mat4) => {
                this.gl_context.uniformMatrix4fv(location, false, m);
            };
        }
        else if (type == this.gl_context.FLOAT_VEC4) {
            return (v : vec4) => {
                this.gl_context.uniform4fv(location, v);
            };
        }
        else if (type == this.gl_context.FLOAT) {
            return (f : number) => {
                this.gl_context.uniform1f(location, f);
            };
        }
        else if (type == this.gl_context.SAMPLER_2D) {
            return (t : WGLTexture) => {
                this.gl_context.activeTexture (this.gl_context.TEXTURE0 + t.imageUnit);
                this.gl_context.uniform1i(location, t.imageUnit);
            };
        }
    }

    protected setUniforms (data : {[name : string] : any}) {
        if (data == null) return;
        
        for (let i = 0; i < this.uniformsNames.length; ++i) {
            if (data[this.uniformsNames[i]] === undefined) throw new Error ("You forgot to give " + this.uniformsNames[i] + " data");
            else {
                this.uniformSetters [this.uniformsNames[i]] (data [this.uniformsNames[i]] as mat4 | vec4);
            }
        }
    }

    protected getAttributeSetter (index : number) {
        return (info : VertexAttrInfo) => {
            this.gl_context.enableVertexAttribArray(index);
            this.gl_context.vertexAttribPointer(index, info.dimension, info.type, info.normalized, info.stride || 0, info.offset || 0);
        };
    }

    protected setAttributes (activeVBO? : WebGLBuffer) {
        //  If activeVBO not passed, or activeVBO is not {this.targetVBO}
        if (activeVBO === undefined || activeVBO != this.targetVBO) {
            this.gl_context.bindBuffer (this.gl_context.ARRAY_BUFFER, this.targetVBO);
        }

        for (let i = 0; i < this.attributesNames.length; ++i) {
            if (this.attrInfos[this.attributesNames [i]] === undefined) throw new Error ("You forgot to give " + this.attributesNames [i] + " data");
            else {
                this.attributesSetters[this.attributesNames [i]] (this.attrInfos [this.attributesNames [i]]);
            }
        }        
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }

    public render(draw_call: DrawCall, activeShader? : Shader, activeVBO? : WebGLBuffer) :void {

        //  If activeShader not passed, or activeShader is not this shader, use {this}
        if (activeShader === undefined || activeShader != this) {
            this.gl_context.useProgram(this.program);
        }

        this.setAttributes (activeVBO);
        
        this.setUniforms (draw_call);
    }
}
export default Shader;
