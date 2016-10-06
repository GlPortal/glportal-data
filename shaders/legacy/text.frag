#version 120

uniform mat4 modelMatrix;

uniform sampler2D diffuse;

varying vec3 pass_position;
varying vec2 pass_texCoord;
varying vec3 pass_normal;
uniform vec4 color;

void main() {
	float smoothing = 0.1;// / (4 * 0.01);
	float mask = texture2D(diffuse, pass_texCoord).a;
        vec4 resultingColor = color;

	if(mask < 0.5) {
		gl_FragColor = vec4(0, 0, 0, 0);
	} else {
		gl_FragColor = vec4(1, 1, 1, 1);
	}

    resultingColor.a *= smoothstep(0.5 - smoothing, 0.5 + smoothing, mask);
    
    gl_FragColor = resultingColor;
}
