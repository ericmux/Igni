abstract class Shader {
    protected vertex_shader: WebGLShader;
    protected fragment_shader: WebGLShader;
    protected program: WebGLProgram;
    protected gl_context: WebGLRenderingContext;

    protected compileProgram(vertex_shader_source :string, fragment_shader_source :string) :void {

        // Load and compile vertex shader.
        this.vertex_shader = this.gl_context.createShader( this.gl_context.VERTEX_SHADER );
        this.gl_context.shaderSource( this.vertex_shader, vertex_shader_source );
        this.gl_context.compileShader( this.vertex_shader );
        if ( !this.gl_context.getShaderParameter(this.vertex_shader, this.gl_context.COMPILE_STATUS) ) {
            let msg = "Vertex shader failed to compile.  The error log is:"
            + "<pre>" + this.gl_context.getShaderInfoLog( this.vertex_shader ) + "</pre>";
            throw new Error(msg);
        }

        this.fragment_shader = this.gl_context.createShader( this.gl_context.FRAGMENT_SHADER );
        this.gl_context.shaderSource( this.fragment_shader, fragment_shader_source );
        this.gl_context.compileShader( this.fragment_shader );
        if ( !this.gl_context.getShaderParameter(this.fragment_shader, this.gl_context.COMPILE_STATUS) ) {
            let msg = "Fragment shader failed to compile.  The error log is:"
            + "<pre>" + this.gl_context.getShaderInfoLog( this.fragment_shader ) + "</pre>";
            alert( msg );
            return null;
        }

        let program = this.gl_context.createProgram();
        this.gl_context.attachShader( program, this.vertex_shader );
        this.gl_context.attachShader( program, this.fragment_shader );
        this.gl_context.linkProgram( program );
        
        if ( !this.gl_context.getProgramParameter(program, this.gl_context.LINK_STATUS) ) {
            var msg = "Shader program failed to link.  The error log is:"
                + "<pre>" + this.gl_context.getProgramInfoLog( program ) + "</pre>";
            alert( msg );
            return null;
        }

        return program;
    }
}
export default Shader;
