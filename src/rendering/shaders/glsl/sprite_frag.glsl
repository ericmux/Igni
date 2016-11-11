precision mediump float;

uniform vec4 color;
uniform sampler2D texture;

varying vec2 f_uv;

void main()
{
	gl_FragColor = texture2D (texture, f_uv) * color;
}