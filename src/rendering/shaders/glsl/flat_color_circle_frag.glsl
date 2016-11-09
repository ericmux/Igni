precision mediump float;

uniform vec4 fColor;
uniform vec4 center;
uniform float radius;

varying vec4 fPosition;

void main()
{
    vec4 color = vec4(fColor.xyz,  1.0 - step(radius, length(fPosition.xy)));
	gl_FragColor = color;
}