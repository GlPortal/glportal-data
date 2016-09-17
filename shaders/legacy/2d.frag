#version 120

uniform sampler2D tex;

in vec2 pass_texCoord;
in vec4 pass_color;
out vec4 out_Color;

void main() {
	out_Color = texture2D(tex, pass_texCoord) * pass_color;
}
