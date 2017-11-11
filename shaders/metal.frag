#version 130

struct Light {
	vec3 position;
	float distance;
	vec3 color;
	float energy;
	float specular;
};

uniform sampler2D diffuse;
uniform sampler2D normalMap;
uniform sampler2D specularMap;

uniform Light lights[64];
uniform int numLights;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;
in vec3 pass_tangent;
invariant in vec3 pass_viewerPos;
invariant in mat3 pass_surf2world;
in vec3 pass_worldPos;

out vec4 out_Color;

void main(void) {
	// Normals
	// Use MAD (Multiply And Add), like below
	vec3 localCoords = (texture(normalMap, pass_texCoord).xyz * 2) - 1;
	vec3 normal = normalize(pass_surf2world * localCoords);
	vec3 viewDirection = normalize(pass_viewerPos - pass_worldPos);
	float gloss = texture(specularMap, pass_texCoord).r * 255.0;
	float normalization = (gloss + 8) * 0.125;
	vec3 diffuseColor = texture(diffuse, pass_texCoord).rgb;

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

	out_Color = vec4(refl, 1.0);
}
