uniform sampler2D tex;

void main()
{
	vec2 xy = cogl_tex_coord_in[0].xy;
	vec4 texColor = texture2D(tex,xy);
	vec3 hsl = rgb2hsv(vec3(texColor.r,texColor.g,texColor.b));
	hsl=correctFilter(hsl);
	texColor.rgb = hsv2rgb(hsl);
	cogl_color_out = texColor;
}
