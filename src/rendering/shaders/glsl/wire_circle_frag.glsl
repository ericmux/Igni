precision mediump float;

uniform vec4 color;
uniform vec4 center;
uniform float radius;
uniform float innerRadius;

varying vec4 f_position;

void main()
{
    float distToCenter = length(f_position.xy); 
    vec4 color = vec4(color.xyz,  step(innerRadius, distToCenter) - step(radius, distToCenter));
	gl_FragColor = color;
}