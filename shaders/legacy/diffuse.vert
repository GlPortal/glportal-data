#version 120

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 invViewMatrix;
uniform mat4 modelTrInv4Matrix;

uniform vec2 tiling;

attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec4 color;

varying vec3 pass_position;
varying vec2 pass_texCoord;
varying vec3 pass_normal;
varying vec3 pass_tangent;
varying vec4 pass_color;
invariant varying vec3 pass_viewerPos;
invariant varying mat3 pass_surf2world;
varying vec3 pass_worldPos;

void main() {
	pass_position = position;
	pass_texCoord = vec2(texCoord.x / tiling.x, texCoord.y / tiling.y);
	pass_tangent = tangent;
	pass_color = color;
	vec4 worldPos = modelMatrix * vec4(position, 1);
	pass_worldPos = worldPos.xyz;

	mat3 modelTrInv3Matrix = mat3(modelTrInv4Matrix);
	pass_surf2world[0] = normalize(vec3(modelMatrix * vec4(tangent, 0.0)));
	pass_surf2world[2] = normalize(modelTrInv3Matrix * normal);
	pass_surf2world[1] = normalize(cross(pass_surf2world[2], pass_surf2world[0]));
	pass_normal = modelTrInv3Matrix * normal;
	pass_viewerPos = (invViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

	gl_Position = projectionMatrix * viewMatrix * worldPos;
}
