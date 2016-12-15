#version 130

uniform sampler2D diffuse;

in vec3 pass_position;
in vec2 pass_texCoord;
in vec3 pass_normal;
uniform vec4 color;
out vec4 out_Color;

void main() {
	float smoothing = 0.1;// / (4 * 0.01);
	float mask = texture(diffuse, pass_texCoord).a;
        vec4 resultingColor = color;

	if(mask < 0.5) {
		out_Color = vec4(0, 0, 0, 0);
	} else {
		out_Color = vec4(1, 1, 1, 1);
	}

    resultingColor.a *= smoothstep(0.5 - smoothing, 0.5 + smoothing, mask);
    
    out_Color = resultingColor;
}
