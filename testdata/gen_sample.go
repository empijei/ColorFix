package main

import (
	"image"
	"image/color"
	"image/png"
	"log"
	"os"

	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	scale := 4
	bounds := image.Rect(0, 0, 360*scale, 20*scale)
	m := image.NewRGBA(bounds)
	for x := bounds.Min.X; x < bounds.Max.X; x += scale {
		color := colorful.Hsl(float64(x/scale), 1, 0.5)
		for y := bounds.Min.Y; y < bounds.Max.Y; y += scale {
			drawPixel(m, x, y, scale, color)
		}
	}

	f, err := os.OpenFile("hsl_rainbow.png", os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		log.Fatal(err)
	}
	err = png.Encode(f, m)
	if err != nil {
		log.Fatal(err)
	}
}

func drawPixel(m *image.RGBA, x, y, scale int, color color.Color) {
	for _x := x; _x < x+scale; _x++ {
		for _y := y; _y < y+scale; _y++ {
			m.Set(_x, _y, color)
		}
	}
}
