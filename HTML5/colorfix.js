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
	console.log(startrgb,derivedrgb)
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
	console.log(startrgb,derivedrgb)
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
	console.log("startrgb:" + startrgb + ",\n derivedhue:"+derivedhue+",\n derivedrgb:" + derivedrgb);
	console.log(lr);
	return lr;
}

function getResult(){
	return colorChecker.iteration*colorChecker.step+colorChecker.hue;
}
