#version 120

uniform mat4 modelMatrix;

uniform sampler2D diffuse;

varying vec3 pass_position;
varying vec2 pass_texCoord;
varying vec3 pass_normal;
varying vec4 pass_color;

void main(void) {
    gl_FragColor = texture2D(diffuse, pass_texCoord) * pass_color;
}
