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
uniform Light lights[100];
uniform int numLights;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;
in vec3 pass_tangent;
in mat3 pass_surf2world;

out vec4 out_Color;

/* Calculates point light attribution */
float calcPointAtt(Light light, vec3 lightDir) {
	float lightLength = length(lightDir);
	float x = lightLength / light.distance;
	float fAtt = 1 - sqrt(x);
	if (fAtt < 0) {
		fAtt = 0;
	}
	return fAtt;
}

void main(void) {
	vec3 refl = vec3(0, 0, 0);

	//Calculate the location of this fragment (pixel) in world coordinates
	vec3 position = (modelMatrix * vec4(pass_position, 1)).xyz;

	// Normals
	vec4 encodedNormal = texture(normalMap, pass_texCoord);
	vec3 localCoords = 2 * encodedNormal.xyz - 1;
	vec3 normal = normalize(pass_surf2world * localCoords);
	vec3 viewDirection = normalize(vec3(invViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) - vec4(position, 1.0)));

	float ambient = 0.3;
	
	for(int i = 0; i < numLights; i++) {
		Light light = lights[i];
		
		//Calculate the vector from this pixels surface to the light source
		vec3 lightDist = light.position - position;
		float fAtt = calcPointAtt(light, lightDist);
		vec3 lightDir = normalize(lightDist);
		float fDiffuse = clamp(dot(normal, lightDir), 0, 1);
		refl += light.color * fDiffuse * light.energy * fAtt;
		if (shininess > 0.0) {
			vec3 halfDir = normalize(lightDir + viewDirection);
			float fSpecular = pow(max(dot(halfDir, normal), 0.0), shininess);
			refl += fAtt * light.specular * fSpecular * texture(specularMap, pass_texCoord).rgb;
		}
	}
	refl += ambient;

	out_Color = vec4(refl, 1) * texture(diffuse, pass_texCoord);
}
