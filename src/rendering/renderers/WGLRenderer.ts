/**
* WebGL functionality
*/
import setupWebGL from "../utils/webgl_utils";
import Renderer from "./Renderer";
import Shape from "../shapes/Shape";
import RectangleShape from "../shapes/RectangleShape";
import Shader from "../shaders/Shader";
import DrawCall from "../shaders/DrawCall";
import {FlatColorShader, FlatColorDrawCall} from "../shaders/FlatColorShader";
import {FlatColorCircleShader, FlatColorCircleDrawCall} from "../shaders/FlatColorCircleShader";
import {SpriteShader, SpriteDrawCall} from "../shaders/SpriteShader";
import {vec2, vec3, vec4, mat4} from "gl-matrix";
import Camera from "../camera/Camera";

export interface WGLOptions {
	depth_test: boolean;
	blend: boolean; 
}

export class WGLRenderer implements Renderer {

	private static CLEAR_COLOR : vec4 = vec4.fromValues(0, 0, 0, 1.0);
	public static gl : WebGLRenderingContext;

	private projection_matrix : mat4;
	private vVBO : WebGLBuffer;
	private canvas : HTMLCanvasElement;
	private camera : Shape;
	private squareShader : Shader;
	private circleShader : Shader;
	private spriteShader : Shader;

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
		//  Bind VBO
        WGLRenderer.gl.bindBuffer(WGLRenderer.gl.ARRAY_BUFFER, this.vVBO);

		// Set up default static camera.
		this.camera = new Camera (vec3.fromValues(0,0,0), 1,1);

		this.canvas = canvas;
		this.squareShader = new FlatColorShader (WGLRenderer.gl, this.vVBO);
		this.circleShader = new FlatColorCircleShader (WGLRenderer.gl, this.vVBO);
		this.spriteShader = new SpriteShader (WGLRenderer.gl, this.vVBO);

		//  Set up viewport and projection matrix
		this.resizeToCanvas ();
		
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

		// Fix viewport and projection matrix. Guaranteed to have same aspect ratio by definition.
		WGLRenderer.gl.viewport (0, 0, this.canvas.width, this.canvas.height);
		this.projection_matrix =  mat4.ortho (mat4.create(), 
							-this.canvas.width/2, 
							this.canvas.width/2, 
							-this.canvas.height/2, 
							this.canvas.height/2, 
							-1,
							1);
	}

	/**
	*  Draw a collection of shapes.
	*/
	public drawShape(shape: Shape) {
		this.render(shape.toDrawCall(this.projection_matrix, this.camera.followShapeViewMatrix()));	
	}

	private render (drawCall: SpriteDrawCall) : void;
	private render (drawCall: FlatColorCircleDrawCall) : void;
	private render (drawCall: FlatColorDrawCall) : void;
	private render (drawCall: DrawCall) : void;
	private render (drawCall: any) : void {
		if (!drawCall) return;
		
		if (drawCall instanceof FlatColorCircleDrawCall) {
			this.circleShader.render(drawCall);
		}
		else if (drawCall instanceof FlatColorDrawCall) {
			this.squareShader.render(drawCall);
		}
		else if (drawCall instanceof SpriteDrawCall) {
			this.spriteShader.render(drawCall);
		}
		else if (typeof drawCall == "DrawCall") {
			console.log ("It is drawcall");
		}
	}

	// Resize canvas to adjust resolution.
	public resizeToCanvas() {
		// Lookup the size the browser is displaying the canvas.
		var displayWidth  = this.canvas.clientWidth;
		var displayHeight = this.canvas.clientHeight;

		this.resize(displayWidth, displayHeight);
	}

	// Set camera object.
	public setCamera(camera : Shape) {
		this.camera = camera;
	} 
}