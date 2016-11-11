precision mediump float;

attribute vec4 position;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform vec4 color;

void main() 
{               
	gl_Position = projection * view * model * position;
} 