uniform int height;
uniform int width;
uniform int mouseX;
uniform int mouseY;

uniform float slider;

uniform sampler2D tex;

void main()
{
  float value = slider;
  if(value < 0.2)
    value = 0.2;
  cogl_color_out = vec4(texture2D( tex, cogl_tex_coord_in[0].xy).rgb * value, 1.0);
}
