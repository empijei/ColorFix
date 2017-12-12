function round(num, points) {
    points = points || 10;
    return parseFloat(num.toFixed(points));
}

function rgb2hex([r,g,b]){
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

function hex2rgb(hex) {
    hex = hex.replace("#","")
    hex = hex.replace("x","")
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function hsv2rgb(HSV, S, V) {
    var rgb = [],
        h, s, v, hi, f, p, q, t;

    if (typeof HSV == 'object') {
        h = HSV[0];
        s = HSV[1];
        v = HSV[2];
    } else {
        h = HSV;
        s = S;
        v = V;
    }
    s = s / 100;
    v = v / 100;
    hi = Math.floor((h / 60) % 6);
    f = (h / 60) - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (hi) {
        case 0:
            rgb = [v, t, p];
            break;
        case 1:
            rgb = [q, v, p];
            break;
        case 2:
            rgb = [p, v, t];
            break;
        case 3:
            rgb = [p, q, v];
            break;
        case 4:
            rgb = [t, p, v];
            break;
        case 5:
            rgb = [v, p, q];
    }

    return [
        Math.min(255, Math.floor(rgb[0] * 256)),
        Math.min(255, Math.floor(rgb[1] * 256)),
        Math.min(255, Math.floor(rgb[2] * 256))
    ];
}

function hsl2rgb (hsl, s, l) {
  if (typeof hsl == 'object') {
      h = hsl[0];
      s = hsl[1];
      l = hsl[2];
  } else {
      h = hsl;
      s = s;
      l = l;
  }
    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return [r, g, b];

}

function rgb2hsl(RGB, G, B) {
    var r, g, b, min, max, h, s, l, d;

    if (typeof RGB === 'object') {
        r = RGB[0];
        g = RGB[1];
        b = RGB[2];
    } else {
        r = RGB;
        g = G;
        b = B;
    }

    r /= 255;
    g /= 255;
    b /= 255;

    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return [
        Math.floor(h * 360),
        round((s * 100), 1),
        round((l * 100), 1)
    ];
};
