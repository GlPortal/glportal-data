#version 130

uniform sampler2D diffuse;
uniform sampler2D normalMap;
uniform sampler2D specularMap;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;

out vec4 out_Color;

void main(void) {
  float ambient = 0.1;
	out_Color = vec4(texture(diffuse, pass_texCoord).rgb * ambient, 1);
}
