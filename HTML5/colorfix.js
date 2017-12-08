function toHex(rgb){
	console.log(rgb);
	[r,g,b]=rgb;
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
		iteration:1,
	};
}

function normalize(startrgb,derivedrgb){
	return [startrgb,derivedrgb];
}

function iterateColors(){
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
	colorChecker.iteration++;
	console.log("startrgb:" + startrgb + ",\n derivedhue:"+derivedhue+",\n derivedrgb:" + derivedrgb);
	return lr;
}
