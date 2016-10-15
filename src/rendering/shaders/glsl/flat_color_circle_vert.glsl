precision mediump float;

attribute vec4 vPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec4 fColor;
uniform vec4 center;
uniform float radius;

varying vec4 fPosition;

void main ()
{
    fPosition = vPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}