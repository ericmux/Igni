/**
* WebGL functionality
*/
import setupWebGL from "./utils/webgl_utils.ts";
import {RENFlatColor} from "./ren_flat_color.ts";
import {ColorSquare} from "./color_square.ts";
import {vec3, vec4, mat4} from "gl-matrix";

interface WGLOptions {
	depth_test: boolean;
	blend: boolean; 
}

export class WGLRenderer {

	public static gl : WebGLRenderingContext = null;
	private static CLEAR_COLOR : vec4 = vec4.fromValues(0.043, 0.075, 0.3372, 1.0);
	private projection_matrix : mat4;

	canvas :  HTMLCanvasElement = null;
	render : RENFlatColor = null;
	square : ColorSquare = null;

	constructor (canvas : HTMLCanvasElement, opts?: WGLOptions) {
		opts = opts || <WGLOptions>{ depth_test: false, blend: false };

		WGLRenderer.gl = setupWebGL (canvas, {antialias: true});
		if (!WGLRenderer.gl) { 
			alert( "WebGL isn't available" ); 
			return;
		}

		if (opts.depth_test)
			WGLRenderer.gl.enable (WGLRenderer.gl.DEPTH_TEST);
			WGLRenderer.gl.depthFunc(WGLRenderer.gl.LEQUAL);
		
		if (opts.blend) {
			WGLRenderer.gl.enable (WGLRenderer.gl.BLEND);
			WGLRenderer.gl.blendFunc (WGLRenderer.gl.SRC_ALPHA, WGLRenderer.gl.ONE_MINUS_SRC_ALPHA);
		}

		this.canvas = canvas;
		this.render = new RENFlatColor ();
		this.square = new ColorSquare (this.render);

		// Set up projection matrix.
		this.projection_matrix = mat4.ortho (mat4.create(), 
									-this.canvas.width/2, 
									this.canvas.width/2, 
									-this.canvas.height/2, 
									this.canvas.height/2, 
									-1, 1);

		// Set up viewport.
		WGLRenderer.gl.viewport (0, 0, this.canvas.width, this.canvas.height);
		WGLRenderer.gl.bindFramebuffer (WGLRenderer.gl.FRAMEBUFFER, null);
		this.clear();
	}

	// Clears the canvas for the next frame.
	private clear() {
		let clear_color : vec4 = WGLRenderer.CLEAR_COLOR;
		WGLRenderer.gl.clearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3]);
		WGLRenderer.gl.clear (WGLRenderer.gl.COLOR_BUFFER_BIT | WGLRenderer.gl.DEPTH_BUFFER_BIT);		
	}

	/**
	*  Execute rendering code
	*/
	draw () {	
		//  Modelview matrix
		let mv : mat4 = mat4.create();
		mat4.identity(mv);

		this.clear();

		this.square.draw (this.projection_matrix, mv);
		mat4.translate(mv, mv, vec3.fromValues(50,50,0));
		this.square.draw(this.projection_matrix, mv);
	}

}