precision mediump float;

uniform vec4 color;
uniform vec4 center;
uniform float radius;

varying vec4 f_position;

void main()
{
    vec4 color = vec4(color.xyz,  1.0 - step(radius, length(f_position.xy)));
	gl_FragColor = color;
}