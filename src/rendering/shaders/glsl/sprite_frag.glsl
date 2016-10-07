precision mediump float;

uniform vec4 fColor;
uniform sampler2D texture;

varying vec2 vTexcoord;

void main()
{
	gl_FragColor = texture2D (texture, vTexcoord);
}