precision mediump float;

uniform vec4 fColor;
uniform vec4 center;
uniform float radius;

varying vec4 fPosition;

void main()
{
    if (length(fPosition.xyz) < radius)
	    gl_FragColor = fColor;
    else
        gl_FragColor = vec4 (0.0, 0.0, 0.0, 0.0);
}