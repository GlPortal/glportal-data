#version 120
#extension GL_ARB_uniform_buffer_object : enable

struct Light {
	vec3 position;
	float distance;
	vec3 color;
	float energy;
	float specular;
};

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
//uniform mat4 invViewMatrix;

uniform sampler2D diffuse;
uniform sampler2D normalMap;
uniform sampler2D specularMap;
#if defined(GL_ARB_uniform_buffer_object) && !defined(RADIX_DISABLE_GL_UBO)
uniform lightsUB {
  Light lights[64];
};
#else
uniform Light lights[64];
#endif
uniform int numLights;

varying vec3 pass_position;
varying vec2 pass_texCoord;
varying vec3 pass_normal;
varying vec3 pass_tangent;
invariant varying vec3 pass_viewerPos;
invariant varying mat3 pass_surf2world;
varying vec3 pass_worldPos;

void main(void) {
	// Normals
	// Use MAD (Multiply And Add), like below
	vec3 localCoords = (texture2D(normalMap, pass_texCoord).xyz * 2) - 1;
	vec3 normal = normalize(pass_surf2world * localCoords);
	vec3 viewDirection = normalize(pass_viewerPos - pass_worldPos);
	float gloss = texture2D(specularMap, pass_texCoord).r * 255.0;
	float normalization = (gloss + 8) * 0.125;
	vec3 diffuseColor = texture2D(diffuse, pass_texCoord).rgb;

	vec3 refl = .3 * diffuseColor;

	for (int i = 0; i < numLights; ++i) {
		// Calculate the vector from this pixels surface to the light source
		vec3 lightDist = lights[i].position - pass_worldPos;
		float lightLength = length(lightDist);
		if (lightLength < lights[i].distance) {
			// Diffuse reflection + normal map
			float fAtt = max(0, 1 - sqrt(lightLength / lights[i].distance));
			vec3 lightDir = lightDist/lightLength;
			float fDiffuse = max(dot(normal, lightDir), 0);

			// Specular reflection
			vec3 halfDir = normalize(lightDir + viewDirection);

			float fSpecular = normalization * pow(max(dot(halfDir, normal), 0), gloss) *
			0.04 + 0.96*pow(1-dot(halfDir, lightDir), 5);

			refl += fAtt * (
				(diffuseColor + vec3(fSpecular)) * fDiffuse * lights[i].energy * lights[i].color
			);
		}
	}

	gl_FragColor = vec4(refl, 1.0);
}
