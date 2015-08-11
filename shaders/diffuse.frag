#version 130

struct Light {
	vec3 position;
	vec3 color;
	float distance;
	float energy;
	float specular;
};

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 invViewMatrix;

uniform sampler2D diffuse;
uniform sampler2D normalMap;
uniform sampler2D specularMap;
uniform float shininess;
uniform Light lights[64];
uniform int numLights;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;
in vec3 pass_tangent;
in mat3 pass_surf2world;
in vec3 pass_viewerPos;
in vec3 pass_worldPos;

out vec4 out_Color;

// Calculates point light attenuation
float calcPointAtt(float lightDist, float lightLength) {
	float x = lightLength / lightDist;
	return max(0, 1 - sqrt(x));
}

void main(void) {
	vec3 refl = vec3(.3, .3, .3);

	// Normals
	vec3 localCoords = 2 * texture(normalMap, pass_texCoord).xyz - 1;
	vec3 normal = normalize(pass_surf2world * localCoords);
	vec3 viewDirection = normalize(pass_viewerPos - pass_worldPos);

	for (int i = 0; i < numLights; ++i) {
		// Calculate the vector from this pixels surface to the light source
		vec3 lightDist = lights[i].position - pass_worldPos;
		float lightLength = length(lightDist);
		if (lightLength < lights[i].distance) {
			float fAtt = calcPointAtt(lights[i].distance, lightLength);
			vec3 lightDir = lightDist/lightLength;
			float fDiffuse = max(dot(normal, lightDir), 0);
			refl += lights[i].color * fDiffuse * lights[i].energy * fAtt;
			
			// Specular reflections
			vec3 halfDir = normalize(lightDir + viewDirection);
			float fSpecular = pow(max(dot(halfDir, normal), 0), shininess);
			refl += fAtt * lights[i].specular * fSpecular * texture(specularMap, pass_texCoord).rgb;
		}
	}

	out_Color = vec4(refl, 1) * texture(diffuse, pass_texCoord);
}
