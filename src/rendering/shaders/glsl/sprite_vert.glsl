precision mediump float;

attribute vec4 vPosition;
attribute vec2 vTexCoord;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 fTexCoord;

void main() 
{               
	fTexCoord = vTexCoord;
	gl_Position = projectionMatrix * modelViewMatrix * vPosition;
} 