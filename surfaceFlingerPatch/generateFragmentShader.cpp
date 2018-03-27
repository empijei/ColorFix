precision mediump float;
uniform sampler2D sampler
varying vec2 outTexCoords;
uniform float alphaPlane;
uniform mat4 colorMatrix;
vec3 OETF_scRGB(const vec3 linear) {
return linear;
}
vec3 EOTF_scRGB(const vec3 srgb) {
return srgb;
}

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
####
vec3 correctFilter(vec3 hsl){
		  //Hue
		  vec2 prev, cur;
		  prev=vec2(1.0,1.0);

		 		if (hsl.x < prev.x){
						 cur=prev;
						 prev=vec2(0.71,0.7444444444444445);
			  }
			  if (hsl.x < prev.x){
						 cur=prev;
						 prev=vec2(0.36,0.36);
			  }
			  if (hsl.x < prev.x){
						 cur=prev;
						 prev=vec2(0.175,0.3194444444444444);
			  }
			  if (hsl.x < prev.x){
						 cur=prev;
						 prev=vec2(0.15694,0.027777777777777776);
			  }
			  if (hsl.x < prev.x){
						 cur=prev;
						 prev=vec2(0.0,0.0);
			  }
	 		float coeff = (hsl.x - prev.x) / (cur.x - prev.x);
		  hsl.x = (coeff*(cur.y-prev.y) + prev.y);

		  //Saturation
		  prev = vec2(0.0,0.0);
		  cur = vec2(0.2,0.4);
		  if (hsl.y > cur.x){
					 prev=cur;
					 cur=vec2(1.0,0.99);
		  }

		  coeff = (hsl.y - prev.x) / (cur.x - prev.x);
		  hsl.y = (coeff*(cur.y-prev.y) + prev.y);

		  return hsl;
}

void main(void) {
####
gl_FragColor = texture2D(sampler, outTexCoords);
gl_FragColor.a = 1.0;
vec4 transformed = colorMatrix * vec4(EOTF_scRGB(gl_FragColor.rgb), 1);
gl_FragColor.rgb = OETF_scRGB(transformed.rgb);

##
vec3 hsl = rgb2hsv(vec3(gl_FragColor.r,gl_FragColor.g,gl_FragColor.b));
hsl=correctFilter(hsl);
gl_FragColor.rgb = hsv2rgb(hsl);
##

}
