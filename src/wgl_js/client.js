///////////////////////////////////////////////////////////////////////////////
//  Resource loader object. The parameter is the number of resources expected
var rl = new ResourceLoader(0);

//  Texture Manager object. The parameter is the number of textures expected
var tm = new TextureManager(0);

/**
*  Code to load resources. The number of resources loaded should be the same as
*  the number at the rl constructor
*/
var load = function(callback) {
   //rl.load_image("sun", "./public/images/sun.png");

   rl.check_is_done(callback);
};

/**
*  Code to configure necessary textures. The number of loaded textures should be
*  the same as explicited at the tm constructor
*/
var config_tex = function(callback) {
   //tm.file_texture("sun", rl._images["sun"]);

   tm.check_is_done(callback);
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var mountain = new Mountain(1.25, 0.4, 33, 33);

var initial_quad = [vec2(0, 0),
                    vec2(0, mountain.nColumns-1),
                    vec2(mountain.nRows-1, mountain.nColumns-1),
                    vec2(mountain.nRows-1, 0), 0];

mountain.quad_queue.push(initial_quad);

var c_red = vec4 (1.0, 0.0, 0.0, 1.0);
var c_blue = vec4 (0.0, 0.0, 1.0, 1.0);
var c_black = vec4 (0.0, 0.0, 0.0, 1.0);

mountain.set_update_interval (40);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var lightAmbient = vec4(0.8, 0.03, 0.03, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 10000.0;

var ambientColor = mult (lightAmbient, materialAmbient);
var diffuseColor = mult (lightDiffuse, materialDiffuse);
var specularColor = mult (lightSpecular, materialSpecular);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var flatrender;
var fragphongrender;

/**
*  Code to render. 
*/  
var render_flat_normals = function (p, mv) {
   //  Draw normals
   flatrender.load_vbo (mountain.normalsLines_f, c_blue, WGL.gl.LINES, 2);
   flatrender.draw (p, mv);

   //  Draw tessalate Lines
   flatrender.load_vbo (mountain.vPosition, c_black, WGL.gl.LINE_LOOP, 4);
   flatrender.draw (p, mv);
   
   //  Draw mountain
   flatrender.load_vbo (mountain.vPosition, c_red, WGL.gl.TRIANGLE_FAN, 4);
   flatrender.draw (p, mv);
};

var render_smooth_normals = function (p, mv) {
   //  Draw normals
   flatrender.load_vbo (mountain.normalsLines_s, c_blue, WGL.gl.LINES, 2);
   flatrender.draw (p, mv);

   //  Draw tessalate Lines
   flatrender.load_vbo (mountain.vPosition, c_black, WGL.gl.LINE_LOOP, 4);
   flatrender.draw (p, mv);
   
   //  Draw mountain
   flatrender.load_vbo (mountain.vPosition, c_red, WGL.gl.TRIANGLE_FAN, 4);
   flatrender.draw (p, mv);
};

var render_frag_phong_flatnormal = function (p, mv) {   
   //  Draw mountain
   fragphongrender.load_vbo (mountain.vPosition, mountain.vNormal_f, WGL.gl.TRIANGLE_FAN, 4,
                             lightPosition, ambientColor, diffuseColor, specularColor, materialShininess);
   fragphongrender.draw (p, mv);
};

var render_frag_phong_smoothnormal = function (p, mv) {   
   //  Draw mountain
   fragphongrender.load_vbo (mountain.vPosition, mountain.vNormal_s, WGL.gl.TRIANGLE_FAN, 4,
                             lightPosition, ambientColor, diffuseColor, specularColor, materialShininess);
   fragphongrender.draw (p, mv);
};

function input_set_render(e) {
    var event = e || window.event;
    var key = event.keyCode;
   
   switch (key) {
      case 49: {
         WGL.set_single_render (render_smooth_normals);
         WGL.render (WGL.scene_render);
      } break;
      case 50: {
         WGL.set_single_render (render_frag_phong_smoothnormal);
         WGL.render (WGL.scene_render);
      } break;

      case 51: {
         WGL.set_single_render (render_flat_normals);
         WGL.render (WGL.scene_render);
      } break;
       
      case 52: {
         WGL.set_single_render (render_frag_phong_flatnormal);
         WGL.render (WGL.scene_render);
      } break;
   }

}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  WGL object
var WGL;

//  WGL parameters.
var wglParam = { 
            depth_test : true,
            blend      : true 
            };


window.onload = function init() {
   //  Init WGL when the window finish loading
   WGL = new WGL (wglParam, function(){});

   //  Queue the render code after WGL initialize
   WGL.queue_render (render_smooth_normals);

   //  Listen of input to change the desired render
   document.addEventListener("keydown", input_set_render);

   start();

};

//  Callback structure designed so the whole application can 
//  initialize in the desired sequence
function start () {
   load (function () {
      config_tex (function () {
            flatrender = new RENFlatColor ();
            fragphongrender = new RENFragPhong ("vs-phong-fragment-color",
                                                "fs-phong-fragment-mountain");
            WGL.render (WGL.scene_render);
      });
   });
}