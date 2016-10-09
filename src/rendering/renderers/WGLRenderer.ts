/**
* WebGL functionality
*/
import setupWebGL from "../utils/webgl_utils.ts";
import Renderer from "./Renderer";
import Shape from "../shapes/Shape";
import Square from "../shapes/Square";
import Shader from "../shaders/Shader";
import {FlatColorShader, FlatColorDrawCall} from "../shaders/FlatColorShader";
import {vec2, vec3, vec4, mat4} from "gl-matrix";

interface WGLOptions {
	depth_test: boolean;
	blend: boolean; 
}

export class WGLRenderer implements Renderer {

	private static CLEAR_COLOR : vec4 = vec4.fromValues(0.043, 0.075, 0.3372, 1.0);
	public static gl : WebGLRenderingContext;

	private projection_matrix : mat4;
	private vVBO : WebGLBuffer;
	private canvas : HTMLCanvasElement;
	private square : Square;
	private activeShader : Shader;

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

		//  Setup VBO.
        this.vVBO = WGLRenderer.gl.createBuffer();

		this.canvas = canvas;
		this.square = new Square ();
		this.activeShader = new FlatColorShader(WGLRenderer.gl, this.vVBO);

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
	public clear() {
		let clear_color : vec4 = WGLRenderer.CLEAR_COLOR;
		WGLRenderer.gl.clearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3]);
		WGLRenderer.gl.clear (WGLRenderer.gl.COLOR_BUFFER_BIT | WGLRenderer.gl.DEPTH_BUFFER_BIT);		
	}

	public resize(width: number, height: number) {
		// Check if the canvas is not the same size.
		if (this.canvas.width  != width ||
			this.canvas.height != height) {
			// Make the canvas the same size
			this.canvas.width  = width;
			this.canvas.height = height;
		}

		// Fix viewport.
		WGLRenderer.gl.viewport (0, 0, this.canvas.width, this.canvas.height);	
	}

	/**
	*  Draw a collection of shapes.
	*/
	public drawShapes(shapes: Shape[]) {	
		let t : number = 0;
		let inc : number = 1;

		setInterval(() => {
			this.clear();
			this.square.translate(vec2.fromValues(inc, 0.0));

			this.activeShader.render(this.square.toDrawCall(this.projection_matrix));

			t += inc;
			if (t == 100) inc = -1;
			else if (t == -100) inc = 1;
		}, 16.7);
	}

	// Resize canvas to adjust resolution.
	public resizeToCanvas() {
		// Lookup the size the browser is displaying the canvas.
		var displayWidth  = this.canvas.clientWidth;
		var displayHeight = this.canvas.clientHeight;

		this.resize(displayWidth, displayHeight);
	}
}