precision mediump float;

attribute vec4 vPosition;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec4 fColor;
uniform vec4 center;
uniform float radius;

varying vec4 fPosition;

void main ()    
{
    //  This expects vPosition to have uniraty abs value on each x,y components
    fPosition = vPosition * radius;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}