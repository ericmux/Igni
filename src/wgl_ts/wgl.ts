/**
* WebGL functionality
*/
import setupWebGL from "./webgl_utils.ts";
import {RENFlatColor} from "./ren_flat_color.ts";
import {ColorSquare} from "./color_square.ts";
import glMatrix = require("gl-matrix");

export class WGL {

	public static gl : WebGLRenderingContext = null;

	canvas :  HTMLCanvasElement = null;
	render : RENFlatColor = null;
	square : ColorSquare = null;

	constructor (canvas : HTMLCanvasElement, params : WGLParams) {
		params = this.process_params (params);

		this.canvas = canvas;
		WGL.gl = setupWebGL (canvas, {});
		if (!WGL.gl) { 
			alert( "WebGL isn't available" ); 
		}

		this.render = new RENFlatColor ();
		this.square = new ColorSquare (this.render);

		if (params.depth_test)
			WGL.gl.enable (WGL.gl.DEPTH_TEST);
			WGL.gl.depthFunc(WGL.gl.LEQUAL);
		
		if (params.blend) {
			WGL.gl.enable (WGL.gl.BLEND);
			WGL.gl.blendFunc (WGL.gl.SRC_ALPHA, WGL.gl.ONE_MINUS_SRC_ALPHA);
		}

		WGL.gl.enable(WGL.gl.POLYGON_OFFSET_FILL);
		WGL.gl.polygonOffset(1.0, 2.0);

		//WGL.gl.getExtension("EXT_frag_depth");

		// Configure WebGL
		WGL.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
		WGL.gl.clearColor(0.043, 0.075, 0.3372, 1.0);	
	}

	setUpViewport () : void {
		WGL.gl.viewport (0, 0, this.canvas.width, this.canvas.height);
		WGL.gl.bindFramebuffer (WGL.gl.FRAMEBUFFER, null);

		WGL.gl.clearColor(0.043, 0.075, 0.3372, 1.0);
		WGL.gl.clear (WGL.gl.COLOR_BUFFER_BIT | WGL.gl.DEPTH_BUFFER_BIT);
		WGL.gl.enable(WGL.gl.CULL_FACE);
	}

	/**
	*  If WGL is initialized with null parameters, give them default values
	*/
	process_params (params : WGLParams) {
		if (undefined === params || null === params) { params = new WGLParams (false, false); }
		return params;
	}

	/**
	*  Execute rendering code
	*/
	draw () {	
		
		let thescale = 1;

		let o : glMatrix.mat4 = glMatrix.mat4.create();
		glMatrix.mat4.ortho (o, -this.canvas.width/2/thescale, this.canvas.width/2/thescale, -this.canvas.height/2/thescale, this.canvas.height/2/thescale, -10, 10);
		
		//  Modelview matrix
		let mv : glMatrix.mat4 = glMatrix.mat4.create();
		glMatrix.mat4.identity(mv);
        glMatrix.mat4.translate(mv, mv, [0,0,-2]);
		
		this.setUpViewport ();

		this.square.draw (o, mv);
	}

}

class WGLParams {
	constructor (public depth_test : boolean, public blend : boolean) {}
}