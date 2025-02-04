vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 correctFilter(vec3 hsl){
	//Hue
	vec2 prev, cur;
	prev=vec2(0.67,0.7611);
	cur=vec2(1.0,1.0);
	if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.3639,0.3639);
	}
	if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.2,0.3333);
	}
	if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.1333,0.0369);
	}
	if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.0,0.0);
	}

	float coeff = (hsl.x - prev.x) / (cur.x - prev.x);
	hsl.x = (coeff*(cur.y-prev.y) + prev.y);

	//Saturation
	prev = vec2(0,0);
	cur = vec2(0.1,0.3);
	if (hsl.y > 0.1){
		prev=cur;
		cur=vec2(1,0.99);
	}

	coeff = (hsl.y - prev.x) / (cur.x - prev.x);
	hsl.y = (coeff*(cur.y-prev.y) + prev.y);

	return hsl;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 xy = fragCoord.xy / iResolution.xy;//Condensing this into one line
	//Get the pixel at xy from iChannel0
	vec4 texColor = texture(iChannel0,xy);
	vec3 hsl = rgb2hsv(vec3(texColor.r,texColor.g,texColor.b));
	hsl=correctFilter(hsl);
	vec3 modified = hsv2rgb(hsl);
	texColor.rgb = modified;
	//Set the screen pixel to that color
	fragColor = texColor;
}


//hsl.x = hsl.x * 360.0;
//prev=vec2(260.0,274.0);
//cur=vec2(360.0,360.0);
//if (hsl.x < 260.0){
//cur=prev;
//prev=vec2(131.0,131.0);
//}
//if (hsl.x < 131.0){
//cur=prev;
//prev=vec2(72.0,120.0);
//}
//if (hsl.x < 72.0){
//cur=prev;
//prev=vec2(48.0,23.0);
//}
//if (hsl.x < 48.0){
//cur=prev;
//prev=vec2(0.0,0.0);
//}

//float coeff = (hsl.x - prev.x) / (cur.x - prev.x);
//hsl.x = (coeff*(cur.y-prev.y) + prev.y)/360.0;

