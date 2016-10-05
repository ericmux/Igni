// import * as fs from "fs";

export default function initShaders ( gl : WebGLRenderingContext,
                       vertexShaderPath : string,
                       fragmentShaderPath : string ) : WebGLProgram
{
    // TODO Make this async later
    let vertexShaderSource = "precision mediump float; attribute vec4 vPosition; uniform mat4 projectionMatrix; uniform mat4 modelViewMatrix; uniform vec4 fColor; void main() { gl_Position = projectionMatrix * modelViewMatrix * vPosition;}";
    //fs.readFileSync (vertexShaderPath, "utf8");

    let fragmentShaderSource = "precision mediump float; uniform vec4 fColor; void main() {	gl_FragColor = fColor; }";// fs.readFileSync (fragmentShaderPath, "utf8");

    let vertShdr : WebGLShader;
    let fragShdr : WebGLShader;

    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertexShaderSource );
    gl.compileShader( vertShdr );
    if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
        let msg = "Vertex shader failed to compile.  The error log is:"
        + "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
        alert( msg );
        return null;
    }

    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragmentShaderSource );
    gl.compileShader( fragShdr );
    if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
        let msg = "Fragment shader failed to compile.  The error log is:"
        + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
        alert( msg );
        return null;
    }

    let program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return null;
    }

    return program;
}
