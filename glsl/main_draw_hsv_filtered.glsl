void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 xy = fragCoord.xy / iResolution.xy;
	vec4 texColor;
	if (xy.y < 0.5){
		texColor.rgb = hsv2rgb(vec3(xy.x,xy.y*2.0,1.0));
	}else{
		//Show filtered image below
		texColor.rgb = hsv2rgb(vec3(xy.x,(xy.y-0.5)*2.0,1.0));
		vec3 hsl = rgb2hsv(vec3(texColor.r,texColor.g,texColor.b));
		hsl=correctFilter(hsl);
		texColor.rgb = hsv2rgb(hsl);
	}
	//Set the screen pixel to that color
	fragColor = texColor;
}
