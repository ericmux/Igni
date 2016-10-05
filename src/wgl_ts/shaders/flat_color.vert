precision mediump float;

attribute vec4 vPosition;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec4 fColor;

void main() 
{               
	gl_Position = projectionMatrix * modelViewMatrix * vPosition;
} 