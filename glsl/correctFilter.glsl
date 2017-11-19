vec3 correctFilter(vec3 hsl){
	//Hue
	vec2 prev, cur;
	prev=vec2(1.0,1.0);
    if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.8,0.8);
	}
    if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.67,0.73);
	}
	if (hsl.x < prev.x){
		cur=prev;
		prev=vec2(0.36,0.34);
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

