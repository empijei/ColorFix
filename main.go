package main

import (
	"image"
	"image/color"
	"image/draw"
	_ "image/jpeg"
	"image/png"
	"log"
	"os"
	"path"

	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	reader, err := os.Open(os.Args[1])
	//reader, err := os.Open("testdata/eye_orgasm.jpeg")
	//reader, err := os.Open("testdata/baloon.png")
	//reader, err := os.Open("testdata/4-test.png")
	//reader, err := os.Open("testdata/tomatoes.png")
	//reader, err := os.Open("testdata/tulips.png")
	//reader, err := os.Open("testdata/purple_crayons.png")
	//reader, err := os.Open("testdata/hsl_rainbow.png")
	if err != nil {
		log.Fatal(err)
	}
	defer func() { _ = reader.Close() }()
	i, _, err := image.Decode(reader)
	if err != nil {
		log.Fatal(err)
	}
	bounds := image.Rectangle{i.Bounds().Min, image.Point{i.Bounds().Max.X * 2, i.Bounds().Max.Y}}
	m := image.NewRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < i.Bounds().Max.X; x++ {
			cur_color := i.At(x, y)
			m.Set(x, y, transform(cur_color))
		}
	}

	draw.Draw(m, image.Rect(i.Bounds().Max.X, 0, i.Bounds().Max.X*2, i.Bounds().Max.Y), i, image.ZP, draw.Src)

	filedir := path.Dir(os.Args[1])
	filename := path.Base(os.Args[1])
	ext := path.Ext(os.Args[1])
	f, err := os.OpenFile(filedir+string(os.PathSeparator)+filename+"-filtered"+ext, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		log.Fatal(err)
	}
	err = png.Encode(f, m)
	if err != nil {
		log.Fatal(err)
	}
}

type correctpoint struct {
	hx float64
	hd float64
}

func filterhue(hue float64) float64 {
	//Punti
	//31 centro arancione
	bars := []correctpoint{
		//Red should be red for deutans, but maybe shift this a little on the left?
		correctpoint{0, 0},

		//Remap Orange to a more red-ish orange
		correctpoint{48, 23},

		//Reduce yellow space
		correctpoint{72, 120},

		//Move all greens where there is no red, try to dodge blue 'though
		correctpoint{131, 131},

		//Remap purple to the right
		correctpoint{260, 274},

		//Last point
		correctpoint{360, 360},
	}
	return applylinearfilter(hue, bars)
}

func correctsat(s float64) float64 {
	bars := []correctpoint{
		correctpoint{0, 0},
		correctpoint{0.1, 0.30},
		correctpoint{1, 1},
	}
	return applylinearfilter(s, bars)
}

func applylinearfilter(value float64, bars []correctpoint) float64 {
	prevbp := bars[0]
	curbp := bars[0]
	for _, bp := range bars {
		prevbp = curbp
		curbp = bp
		if value < bp.hx {
			break
		}
	}
	coeff := (value - prevbp.hx) / (curbp.hx - prevbp.hx)
	return coeff*(curbp.hd-prevbp.hd) + prevbp.hd
}

func transform(in color.Color) color.Color {
	//r, g, b, _ := in.RGBA()
	out := colorful.MakeColor(in)
	h, s, l := out.Hsl()
	//Boost saturation by 15%, which might help in case of faint colors
	//Apply the filter on hue
	shifted := filterhue(h)
	//Increase saturation
	s = correctsat(s)
	out = colorful.Hsl(shifted, s, l)
	//shifted := drawbands(h)
	//out = colorful.Hsl(h, s, l*shifted)
	return out
}

/*

type simpleColor struct {
	r, g, b, a uint32
}

func (s simpleColor) RGBA() (r, g, b, a uint32) {
	return s.r, s.g, s.b, s.a
}

	//very dumb filter
	//threshold := 0x14ffe
	var threshold uint32 = 0xffff
	//max := 0x1fffe
	if sum := r + g + b; sum >= threshold {
		coeff := 1 - (float64(sum-threshold) / float64(threshold))
		coeff *= 0.8
		coeff += 0.2
		h, s, l := out.Hsl()
		out = colorful.Hsl(h, s*coeff, l)
	}

*/

/*
func filter(hue float64) (coeff float64) {

	type barpoint struct {
		huebegin   float64
		coeffvalue int
	}
	high := 1
	low := 0
	bars := []barpoint{
		barpoint{0, high},
		//red
		barpoint{10, low},
		//red→orange→yellow
		barpoint{55, high},
		//yellow
		barpoint{65, low},
		//yellow→green
		barpoint{130, high},
		//green
		barpoint{140, low},
		//green→cyan
		barpoint{180, high},
		//cyan
		barpoint{190, low},
		//cyan→blue
		barpoint{235, high},
		//blue→red
		barpoint{360, high},
	}
	//TODO implement binsearch/a continuous function
	prevbp := bars[0]
	curbp := bars[0]
	for _, bp := range bars {
		prevbp = curbp
		curbp = bp
		if hue < bp.huebegin {
			break
		}
	}
	if prevbp.coeffvalue == high {
		return hue
	}
	span := prevbp.huebegin - curbp.huebegin
	pos := hue - prevbp.huebegin
	coeff = pos/span - 0.5
	shift := 20.0
	return hue + coeff*shift
}
*/

func drawbands(hue float64) (coeff float64) {
	type barpoint struct {
		huebegin   float64
		coeffvalue float64
	}
	high := 1.0
	low := 0.4
	bars := []barpoint{
		barpoint{0, high},
		//red
		barpoint{10, low},
		//red→orange→yellow
		barpoint{55, high},
		//yellow
		barpoint{65, low},
		//yellow→green
		barpoint{130, high},
		//green
		barpoint{140, low},
		//green→cyan
		barpoint{180, high},
		//cyan
		barpoint{190, low},
		//cyan→blue
		barpoint{235, high},
		//blue→red
		barpoint{360, high},
	}
	coeff = bars[0].coeffvalue
	for _, bp := range bars {
		if bp.huebegin > hue {
			return coeff
		}
		coeff = bp.coeffvalue
	}
	return coeff
}
