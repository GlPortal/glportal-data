#version 130

uniform vec4 color;
out vec4 colorOut;
 
void main()
{
   // colorOut = vec4(1.0, 0.0, 0.0, 1.0);
    colorOut = color;
}
