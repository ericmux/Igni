precision mediump float;

attribute vec4 vPosition;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec4 fColor;

void main() 
{               
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
} 