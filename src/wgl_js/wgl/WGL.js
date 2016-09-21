/**
* WebGL functionality
*/
var WGL = function (params, callback) {
	params = this.process_params (params);

	this.canvas = document.getElementById ("gl-canvas");
    
    this.gl = WebGLUtils.setupWebGL (this.canvas);
    if (!this.gl) { 
        alert( "WebGL isn't available" ); 
    }
    

    console.log(this.gl);


    if (params["depth_test"])
    	this.gl.enable (this.gl.DEPTH_TEST);
    	this.gl.depthFunc(this.gl.LEQUAL);
    
    if (params["blend"]) {
    	this.gl.enable (this.gl.BLEND);
    	this.gl.blendFunc (this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    
    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 2.0);

	//this.gl.getExtension("EXT_frag_depth");

    // Configure WebGL
    this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
    this.gl.clearColor(0.043, 0.075, 0.3372, 1.0);	
	theAspect = this.canvas.width * 1.0 / this.canvas.height;

	this.init_input ();

	// REFACTOR THIS
	// init_pick_func(this.gl);

	this.render_code = [];
	this.cprender_code = [];

	callback ();
};

/**
*  If WGL is initialized with null parameters, give them default values
*/
WGL.prototype.process_params = function (params) {
	if (undefined === params || null === params) { params = {}; }
	if (! params['depth_test']) { params.depth_test = false; }
	if (! params['blend']) { params.blend = false; }
	return params;
};

/**
*  Add the callback functions to the necessary input listeners
*/
WGL.prototype.init_input = function () {
	this.canvas.addEventListener ("mousedown", onMouseDown);
    this.canvas.addEventListener ("mousemove", onMouseMove);
    this.canvas.addEventListener ("mouseup", onMouseUp);
};


/**
*  Projection transformation parameters
*/
var	theFovy = 45.0;   // Field-of-view in Y direction angle (in degrees)
var theAspect;        // Viewport aspect ratio
var theZNear = 0.1;
var theZFar = 15000.0;

/**
*  Add func to the render queue
*/
WGL.prototype.set_single_render = function (func) {
	this.render_code = [];
	this.render_code.push (func);
}
WGL.prototype.queue_render = function (func) {
	this.render_code.push (func);
}
WGL.prototype.queue_cprender = function (func) {
	this.cprender_code.push (func);
}

/**
*  Execute rendering code
*/
WGL.prototype.render = function (rendering) {	
	
    var  p = perspective (theFovy, theAspect, theZNear, theZFar);

    var thescale = 400;

    var o = ortho (-this.canvas.width/2/thescale, this.canvas.width/2/thescale, -this.canvas.height/2/thescale, this.canvas.height/2/thescale, -10, 10);
    //  Modelview matrix
	var t = translate (0, 0, -2.0);
	var s = scale (theScale, theScale, theScale);
	var r = buildRotationMatrix (theCurtQuat);
	
	var mv = mat4 ();
	mv = mult (mv, t);
	mv = mult (mv, s);
	mv = mult (mv, r);
	
	this.setUpViewport ();

	rendering (o, mv);
}

WGL.prototype.scene_render = function (p, mv) {
	//  Render all the functions queued in 'render_code'
	for(var i = 0; i < WGL.render_code.length; ++i) {
		var r = WGL.render_code[i];
		r (p, mv);
	}
}

WGL.prototype.cp_render = function (p, mv) {
	//  Render all the functions queued in 'render_code'
	for(var i = 0; i < WGL.cprender_code.length; ++i) {
		var r = WGL.cprender_code[i];
		r (p, mv);
	}
}

WGL.prototype.setUpViewport = function () {
	this.gl.viewport (0, 0, this.canvas.width, this.canvas.height);
    this.gl.bindFramebuffer (this.gl.FRAMEBUFFER, null);

    //WGL.gl.clearColor(0.043, 0.075, 0.3372, 1.0);
    this.gl.clearColor (0.0, 0.0, 0.0, 1.0);
    this.gl.clear (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.CULL_FACE);
}
