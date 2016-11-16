/**
* WebGL functionality
*/
import setupWebGL from "../utils/webgl_utils";
import Renderer from "./Renderer";
import Shape from "../shapes/Shape";
import RectangleShape from "../shapes/RectangleShape";
import Shader from "../shaders/Shader";
import {DrawCall, Renderable} from "../shaders/DrawCall";
import {WireCircleShader, WireCircleDrawCall} from "../shaders/debug/WireCircleShader";
import {WireQuadShader, WireQuadDrawCall} from "../shaders/debug/WireQuadShader";
import {FlatColorShader, FlatColorDrawCall} from "../shaders/FlatColorShader";
import {FlatColorCircleShader, FlatColorCircleDrawCall} from "../shaders/FlatColorCircleShader";
import {SpriteShader, SpriteDrawCall} from "../shaders/SpriteShader";
import {LineShader, LineDrawCall} from "../shaders/LineShader";
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
	private currentVBO : WebGLBuffer;
	private quadVBO : WebGLBuffer;
	private lineVBO : WebGLBuffer;
	private canvas : HTMLCanvasElement;
	private camera : Shape;

	private currentShader : Shader;
	private squareShader : Shader;
	private circleShader : Shader;
	private spriteShader : Shader;
	private wireQuadShader : Shader;
	private wireCircleShader : Shader;
	private lineShader : Shader;

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

		this.setupDefaultVBOS ();

		// Set up default static camera.
		this.camera = new Camera (vec2.fromValues(0,0), 1,1);

		this.canvas = canvas;
		this.squareShader = new FlatColorShader (WGLRenderer.gl, this.quadVBO);
		this.circleShader = new FlatColorCircleShader (WGLRenderer.gl, this.quadVBO);
		this.spriteShader = new SpriteShader (WGLRenderer.gl, this.quadVBO);
		this.wireQuadShader = new WireQuadShader (WGLRenderer.gl, this.quadVBO);
		this.wireCircleShader = new WireCircleShader (WGLRenderer.gl, this.quadVBO);
		this.lineShader = new LineShader (WGLRenderer.gl, this.lineVBO);

		//  Set up viewport and projection matrix
		this.resizeToCanvas ();
		
		WGLRenderer.gl.bindFramebuffer (WGLRenderer.gl.FRAMEBUFFER, null);
		this.clear();
	}

	private setupDefaultVBOS () {
		//  Setup Quad VBO.
        this.quadVBO = WGLRenderer.gl.createBuffer();
		//  Bind VBO
        WGLRenderer.gl.bindBuffer(WGLRenderer.gl.ARRAY_BUFFER, this.quadVBO);
		//  Buffer data:
		//  4 vertex attributes positions (4 componentes each).
		//  4 vetex attributes uv (2 componentes each)
		//  total length: 4 * 4 + 4 * 2 = 24 floats buffer size
		let data = [-1.0, -1.0, 0, 1, -1.0, 1.0, 0, 1, 1.0, 1.0, 0 , 1, 1.0, -1.0, 0, 1,
		             0, 0, 0, 1, 1, 1, 1, 0];
		let quadVertices = new Float32Array (data);
		WGLRenderer.gl.bufferData (WGLRenderer.gl.ARRAY_BUFFER, quadVertices, WGLRenderer.gl.STATIC_DRAW);

		//  Setup Quad VBO.
        this.lineVBO = WGLRenderer.gl.createBuffer();
		//  Bind VBO
        WGLRenderer.gl.bindBuffer(WGLRenderer.gl.ARRAY_BUFFER, this.lineVBO);
		//  Buffer data:
		//  4 vertex attributes positions (4 componentes each).
		//  total length: 2 * 4
		data = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0];
		let lineVertices = new Float32Array (data);
		WGLRenderer.gl.bufferData (WGLRenderer.gl.ARRAY_BUFFER, lineVertices, WGLRenderer.gl.STATIC_DRAW);
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

	public debugDraw (renderable : Renderable) {
		this.render(this.toDebugDrawCall (
			renderable.toDrawCall(this.projection_matrix, this.camera.followShapeViewMatrix())
		    )
		);		
	}

	private toDebugDrawCall (drawCall: SpriteDrawCall) : DrawCall;
	private toDebugDrawCall (drawCall: FlatColorCircleDrawCall) : DrawCall;
	private toDebugDrawCall (drawCall: FlatColorDrawCall) : DrawCall;
	private toDebugDrawCall (drawCall: DrawCall) : DrawCall;
	private toDebugDrawCall (drawCall: any) : DrawCall {

		if (drawCall instanceof LineDrawCall) { 
			return drawCall;
		}
		if (drawCall instanceof FlatColorCircleDrawCall) {
				
			drawCall = drawCall as FlatColorCircleDrawCall;
			
			return new WireCircleDrawCall (drawCall.projection, drawCall.view, drawCall.model, vec4.fromValues (1,1,1,1), drawCall.center, drawCall.radius, drawCall.radius - 1);
		}
		else if (drawCall instanceof SpriteDrawCall ||
		    drawCall instanceof FlatColorDrawCall)
		{
			drawCall = drawCall as FlatColorDrawCall;
			
			return new WireQuadDrawCall (drawCall.projection, drawCall.view, drawCall.model, vec4.fromValues (1,1,1,1), 1)
		}  

		return drawCall;
	}

	/**
	*  Draw a collection of shapes.
	*/
	public drawShape(shape: Shape) {
		this.render(shape.toDrawCall(this.projection_matrix, this.camera.followShapeViewMatrix()));	
	}

	private render (drawCall: WireCircleDrawCall) : void;
	private render (drawCall: WireQuadDrawCall) : void;
	private render (drawCall: LineDrawCall) : void;
	private render (drawCall: SpriteDrawCall) : void;
	private render (drawCall: FlatColorCircleDrawCall) : void;
	private render (drawCall: FlatColorDrawCall) : void;
	private render (drawCall: DrawCall) : void;
	private render (drawCall: any) : void {
		if (!drawCall) return;
		
		if (drawCall instanceof WireQuadDrawCall) {
			this.wireQuadShader.render(drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.quadVBO;
			this.currentShader = this.spriteShader;
		}
		else if (drawCall instanceof WireCircleDrawCall) {
			this.wireCircleShader.render (drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.quadVBO;
			this.currentShader = this.spriteShader;
		}
		else if (drawCall instanceof LineDrawCall) {
			this.lineShader.render (drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.lineVBO;
			this.currentShader = this.lineShader;
		}
		else if (drawCall instanceof FlatColorCircleDrawCall) {
			
			this.circleShader.render(drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.quadVBO;
			this.currentShader = this.circleShader;
		}
		else if (drawCall instanceof FlatColorDrawCall) {

			this.squareShader.render(drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.quadVBO;
			this.currentShader = this.squareShader;
		}
		else if (drawCall instanceof SpriteDrawCall) {

			this.spriteShader.render(drawCall, this.currentShader, this.currentVBO);

			this.currentVBO = this.quadVBO;
			this.currentShader = this.spriteShader;
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