import FlatColorShader from "./shaders/FlatColorShader";
import {WGLRenderer} from "./WGLRenderer.ts";
import {vec4, mat4} from "gl-matrix";

export class RENFlatColor {

    program : WebGLProgram;
    vVBO : WebGLBuffer;
    n_vertex : number;
    render_type : number;
    vertex_step : number;
    render_color : vec4;

    constructor () {
        //  The generic program used to render
        this.program = new FlatColorShader(WGLRenderer.gl).getProgram();
        //  VBO for both vertices and texture coordinates
        this.vVBO = WGLRenderer.gl.createBuffer ();
    }
    
    load_vbo (vertices : Float32Array, color : vec4, r_type : number, vert_step : number) : void {
        // Load the data into the VBOs
        WGLRenderer.gl.bindBuffer(WGLRenderer.gl.ARRAY_BUFFER, this.vVBO);
        WGLRenderer.gl.bufferData(WGLRenderer.gl.ARRAY_BUFFER, vertices, WGLRenderer.gl.STATIC_DRAW);
    
        this.n_vertex = vertices.length/4;
        this.render_color = color;
        this.render_type = r_type;
        this.vertex_step = vert_step;
    }
    
    draw (p : mat4, mv : mat4) : void {
        WGLRenderer.gl.useProgram(this.program);

        WGLRenderer.gl.uniformMatrix4fv( WGLRenderer.gl.getUniformLocation(this.program, "projectionMatrix"),false, p); // fltten(p)
        WGLRenderer.gl.uniformMatrix4fv( WGLRenderer.gl.getUniformLocation(this.program, "modelViewMatrix"),false, mv); // flatten(mv)

        WGLRenderer.gl.uniform4fv( WGLRenderer.gl.getUniformLocation(this.program, "fColor"), this.render_color);

        // Associate out shader variables with our data buffer
        var vPosition = WGLRenderer.gl.getAttribLocation(this.program, "vPosition");
        WGLRenderer.gl.bindBuffer(WGLRenderer.gl.ARRAY_BUFFER, this.vVBO);
        WGLRenderer.gl.vertexAttribPointer(vPosition, 4, WGLRenderer.gl.FLOAT, false, 0, 0);
        WGLRenderer.gl.enableVertexAttribArray(vPosition);

        for (var i = 0; i < this.n_vertex; i+=this.vertex_step) {        
            WGLRenderer.gl.drawArrays(this.render_type, i, this.vertex_step );
        }
    }
}


