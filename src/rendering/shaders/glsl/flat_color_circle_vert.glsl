precision mediump float;

attribute vec4 position;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform vec4 color;
uniform vec4 center;
uniform float radius;

varying vec4 f_position;

void main ()    
{
    //  This expects vPosition to have uniraty abs value on each x,y components
    fPosition = f_position * radius;
    gl_Position = projection * view * model * position;
}