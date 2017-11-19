//Run with compton --backend glx --force-win-blend --glx-fshader-win "$(cat compton_deut.frag)"
void main()
{
	vec4 texColor = texture2D(tex, gl_TexCoord[0].st);
	vec3 hsl = rgb2hsv(vec3(texColor.r,texColor.g,texColor.b));
	hsl=correctFilter(hsl);
	texColor.rgb = hsv2rgb(hsl);
	gl_FragColor = texColor;
}
