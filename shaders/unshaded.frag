#version 130

uniform sampler2D diffuse;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;
in vec4 pass_color;

out vec4 out_Color;

void main(void) {
    out_Color = texture(diffuse, pass_texCoord) * pass_color;
}
