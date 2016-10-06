#version 120

uniform mat4 projectionMatrix;

in vec2 position;
in vec2 texCoord;
in vec4 color;

out vec2 pass_texCoord;
out vec4 pass_color;

void main() {
	pass_texCoord = texCoord;
	pass_color = color;
	gl_Position = projectionMatrix * vec4(position, 0, 1);
}
