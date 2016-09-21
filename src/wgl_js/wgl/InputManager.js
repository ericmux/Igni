// Rotation parameters
var theAngle = 0.0;
var theAxis = [];

var theTrackingMove = false;
var theScalingMove = false;

var	theLastPos = [];
var	theCurtX, theCurtY;
var	theStartX, theStartY;
var	theCurtQuat = [0.97, 0.25, 0, 0];
var	theScale = 1.0;
var theInit = true;

function getMousePos(e, canvas)
{
	var event = e || window.event;
	var client_x_r = event.clientX - canvas.offsetLeft;
	var client_y_r = event.clientY - canvas.offsetTop;
	var clip_x = -1 + 2 * client_x_r / canvas.width;
	var clip_y = -1 + 2 * (canvas.height - client_y_r) / canvas.height;
	var t = vec2(clip_x, clip_y);
	
	return t;
}

function getMouseCanvasPos (e, canvas) {
	var event = e || window.event;
	var client_x_r = event.clientX - canvas.offsetLeft;
	var client_y_r = event.clientY - canvas.offsetTop;
	var t = vec2 (client_x_r, client_y_r);

	return t;
}

function startMotion(x, y)
{
	theTrackingMove = true;
	theStartX = x;
	theStartY = y;
	theCurtX = x;
	theCurtY = y;
	trackball_ptov(x, y, theLastPos);
}

function stopMotion(x, y)
{
    theTrackingMove = false;
	
	/* check if position has changed */
    if (theStartX == x && theStartY == y) {
	     theAngle = 0.0;
    }
}

function startScale(x, y)
{
	theScalingMove = true;
	theCurtX = x;
	theCurtY = y;
}

function stopScale(x, y)
{
    theScalingMove = false;
}

function onMouseDown(e){
	var pos = getMousePos(e, this);
	var x = pos[0];
	var y = pos[1];
	
	if (e.button == 0) { 
		startMotion(x, y);
	} else if (e.button == 1) {
		startScale(x, y);
	}

	//REFACTOR
	var mousecanvaspos = getMouseCanvasPos (e, this);	
	var canvasx = mousecanvaspos[0];
	var canvasy = mousecanvaspos[1];
	// console.log(canvasx + ', ' + canvasy);
	// pick_render_and_display_color(canvasx, canvasy);

	// var color = new Uint8Array(4);
	
	// var a = e.clientX;
	// var b = WGL.canvas.height - e.clientY;

	// WGL.gl.readPixels (a, b, 1, 1, WGL.gl.RGBA, WGL.gl.UNSIGNED_BYTE, color);
	// console.log(color);
} 

function onMouseMove(e){
	var pos = getMousePos(e, this);   
	var x = pos[0];
	var y = pos[1];
	
	var curPos = [];
	var dx, dy, dz;

	/* compute position on hemisphere */
	trackball_ptov(x, y, curPos);
	
	if(theTrackingMove)
	{    
		/* compute the change in position 
		on the hemisphere */
		dx = curPos[0] - theLastPos[0];
		dy = curPos[1] - theLastPos[1];
		dz = curPos[2] - theLastPos[2];
		if (dx || dy || dz) 
		{
			/* compute theta and cross product */
			theAngle = 90.0 * Math.sqrt(dx*dx + dy*dy + dz*dz) / 180.0 * Math.PI;
			theAxis = cross(theLastPos, curPos);
            
			var q = trackball_vtoq(theAngle, theAxis);
	
			// if (theInit) {
			// 	theCurtQuat = q;
			// 	theInit = false;
			// } else {	
				theCurtQuat = multiplyQuat(q, theCurtQuat);
			//}

			/* update position */
			theLastPos[0] = curPos[0];
			theLastPos[1] = curPos[1];
			theLastPos[2] = curPos[2];
		}

		WGL.render (WGL.scene_render);
	} 

	if (theScalingMove) {
		if (theCurtX != x || theCurtY != y) {
    
			theScale += (theCurtY * 1.0 - y)/2.0 * 1.3 * theScale; // 2.0 - the windows height
			if (theScale <= 0.0) {
				theScale = 0.00000001;
			}
    
			theCurtX = x;
			theCurtY = y;
		}	

		WGL.render (WGL.scene_render);
	}	

}

function onMouseUp(e) {
	var pos = getMousePos(e, this);
	var x = pos[0];
	var y = pos[1];
	
	if (e.button == 0) { 
		stopMotion(x, y);
	} else if (e.button == 1) {
		stopScale(x, y);
	}
}



    
/*
    document.addEventListener("keyup", function(e) {
        var event = e || window.event;
        var key = event.keyCode;
        var moved = false;

        keyUp(key);
    } );
	*/