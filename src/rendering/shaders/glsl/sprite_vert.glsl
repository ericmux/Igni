precision mediump float;

attribute vec4 position;
attribute vec2 uv;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

varying vec2 f_uv;

void main() 
{               
	f_uv = uv;
	gl_Position = projection * view * model * position;
} 