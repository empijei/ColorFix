function toHex([r,g,b]){
	r|=0;
	g|=0;
	b|=0;
	var toCoupleHex = function(x){
		if (x.length <2){
			x = "0"+x
		}
		return x
	}
	return "#"+
		toCoupleHex(r.toString(16))+
		toCoupleHex(g.toString(16))+
		toCoupleHex(b.toString(16));
}

var colorChecker;
function setupChecker(hue, step){
	colorChecker = {
		hue:hue,
		step:step,
		iteration:0,
	};
}


function normalize(startrgb,derivedrgb){
	//console.log(startrgb,derivedrgb)
	getLight255 = function ([r,g,b]){
		return r*r * 0.241 + g*g * 0.691 + b*b * 0.068;
	}
	adapt = function([r,g,b],k){
		return [r *Math.sqrt(k), g *Math.sqrt(k), b *Math.sqrt(k)];
	}
	var sl =  getLight255(startrgb);
	var dl = getLight255(derivedrgb);
	if (sl>dl){
		startrgb = adapt(startrgb,dl/sl);
	}else{
		derivedrgb = adapt(derivedrgb,sl/dl);
	}
	//console.log(startrgb,derivedrgb)
	return [startrgb,derivedrgb];
}

function iterateColors(){
	colorChecker.iteration++;
	var startrgb = hsv2rgb([colorChecker.hue,100,100]);
	var derivedhue = colorChecker.hue+
		colorChecker.step*colorChecker.iteration;
	if (derivedhue > 360){
		derivedhue %= 360;
	}
	if (derivedhue < 0){
		derivedhue = 360 - derivedhue;
	}
	derivedrgb = hsv2rgb([derivedhue,100,100]);
	var lr = normalize(startrgb, derivedrgb);
	//console.log("startrgb:" + startrgb + ",\n derivedhue:"+derivedhue+",\n derivedrgb:" + derivedrgb);
	//console.log(lr);
	return lr;
}

function getResult(){
	if (colorChecker){
		return colorChecker.iteration*colorChecker.step+colorChecker.hue;
	}
}

var statesCursor = -1;
var states = [
	{
		colorName: "red",
		normal: 0.15694,
		center: 60,
		step: -5
	},
	{
		colorName: "green",
		normal: 0.17500,
		center: 60,
		step: 5
	},
	{
		colorName: "blue",
		normal: 0.71,
		center: 240,
		step: 7
	},
]

var results = {};

function advanceTest(){
	if (statesCursor >= 0 && statesCursor < states.length) {
		results[states[statesCursor].colorName]={
			outcome: getResult()/360,
			expected: states[statesCursor].normal,
		}
	}
	statesCursor++
	return states[statesCursor];
}

function genShader(){
	console.log(results);
	var shaderTmpl = `vec3 correctFilter(vec3 hsl){
		  //Hue
		  vec2 prev, cur;
		  prev=vec2(1.0,1.0);
	 /*
	 if (hsl.x < prev.x){
					 cur=prev;
					 prev=vec2(0.8,0.8);
		  }
		  */
	 if (hsl.x < prev.x){
					 cur=prev;
					 prev=vec2(${results.blue.expected},${results.blue.outcome});
		  }
		  if (hsl.x < prev.x){
					 cur=prev;
					 prev=vec2(0.36,0.36);
		  }
		  if (hsl.x < prev.x){
					 cur=prev;
					 prev=vec2(${results.green.expected},${results.green.outcome});
		  }
		  if (hsl.x < prev.x){
					 cur=prev;
					 prev=vec2(${results.red.expected},${results.red.outcome});
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
`;
	return shaderTmpl;
}
