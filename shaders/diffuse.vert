#version 130
#extension GL_ARB_separate_shader_objects : enable
#extension GL_ARB_explicit_attrib_location : enable

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelTrInv4Matrix;

uniform vec2 tiling;

//layout(location = 0) in vec3 position;
//layout(location = 1) in vec2 texCoord;
//layout(location = 2) in vec3 normal;
in vec3 position;
in vec2 texCoord;
in vec3 normal;
in vec3 tangent;
in vec4 color;

out vec3 pass_position;
out vec2 pass_texCoord;
out vec3 pass_normal;
out vec3 pass_tangent;
out mat3 pass_surf2world;
out vec4 pass_color;

void main() {
	pass_position = position;
	pass_texCoord = vec2(texCoord.x / tiling.x, texCoord.y / tiling.y);
	pass_tangent = tangent;
	pass_color = color;

	mat3 modelTrInv3Matrix = mat3(modelTrInv4Matrix);
	pass_surf2world[0] = normalize(vec3(modelMatrix * vec4(tangent, 0.0)));
	pass_surf2world[2] = normalize(modelTrInv3Matrix * normal);
	pass_surf2world[1] = normalize(cross(pass_surf2world[2], pass_surf2world[0]));
	pass_normal = modelTrInv3Matrix * normal;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}
