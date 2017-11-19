void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 xy = fragCoord.xy / iResolution.xy;
	fragColor.xyz = hsv2rgb(vec3(xy.x,xy.y,1.0));
}
