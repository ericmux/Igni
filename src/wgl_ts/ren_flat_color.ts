import initShaders from "./initShaders.ts";
import {WGL} from "./wgl.ts";
import {vec4} from "gl-matrix";
import {mat4} from "gl-matrix";

export class RENFlatColor {

    program : WebGLProgram;
    vVBO : WebGLBuffer;
    n_vertex : number;
    render_type : number;
    vertex_step : number;
    render_color : vec4;

    constructor () {
        //  The generic program used to render
        this.program = initShaders (WGL.gl, "./shaders/flat_color.vert", "./shaders/flat_color.frag");
        //  VBO for both vertices and texture coordinates
        this.vVBO = WGL.gl.createBuffer ();
    }
    
    load_vbo (vertices : Float32Array, color : vec4, r_type : number, vert_step : number) : void {
        // Load the data into the VBOs
        WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
        WGL.gl.bufferData(WGL.gl.ARRAY_BUFFER, vertices, WGL.gl.STATIC_DRAW);
    
        this.n_vertex = vertices.length/4;
        this.render_color = color;
        this.render_type = r_type;
        this.vertex_step = vert_step;
    }
    
    draw (p : mat4, mv : mat4) : void {
        WGL.gl.useProgram(this.program);

        WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "projectionMatrix"),false, p); // fltten(p)
        WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "modelViewMatrix"),false, mv); // flatten(mv)

        WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "fColor"), this.render_color);

        // Associate out shader variables with our data buffer
        var vPosition = WGL.gl.getAttribLocation(this.program, "vPosition");
        WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
        WGL.gl.vertexAttribPointer(vPosition, 4, WGL.gl.FLOAT, false, 0, 0);
        WGL.gl.enableVertexAttribArray(vPosition);

        for (var i = 0; i < this.n_vertex; i+=this.vertex_step) {        
            WGL.gl.drawArrays(this.render_type, i, this.vertex_step );
        }
    }
}


