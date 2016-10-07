precision mediump float;

attribute vec4 vPosition;
attribute vec2 vTexcoord;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 fTexcoord;

void main() 
{               
	fTexcoord = vTexcoord;
	gl_Position = projectionMatrix * modelViewMatrix * vPosition;
} 