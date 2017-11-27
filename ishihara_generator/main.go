package main

import (
	"fmt"

	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	starting := colorful.LinearRgb(0.8, 0.8, 0.07)
	l, a, b := starting.Lab()
	ar, al := a, a
	k := 0.01
	fmt.Printf("Lab: %f, %f, %f\n", l, a, b)
	fmt.Printf("Lab: %f, %f, %f\n", l*100, a*128, b*128)
	var left, right colorful.Color
	for i := 1; i < 40; i++ {
		left = colorful.Lab(l, al, b)
		right = colorful.Lab(l, ar, b)
		//left = colorful.Lab(l, a-(float64(i)*0.01), b)
		//right = colorful.Lab(l, a+(float64(i)*0.01), b)
		for checkOVF(right.LinearRgb()) {
			//fmt.Println("Overflow detected")
			l -= 0.05
			left = colorful.Lab(l, al, b)
			right = colorful.Lab(l, ar, b)
		}
		//fmt.Printf("(%v; %v),", getTuple(left.Lab()), getTuple(right.Lab()))
		fmt.Printf("(%s, %s),", printRGB(left.LinearRgb()), printRGB(right.LinearRgb()))
		//fmt.Printf("(%v; %v),", right.Hex(), left.Hex())
		ar += k
		al -= k
		println()
	}
}

func checkOVF(r, g, b float64) bool {
	return r > 1.0 || g > 1.0 || b > 1.0
}

func printRGB(r, g, b float64) string {
	return fmt.Sprintf("\"#%02X%02X%02X\"", int(r*255), int(g*255), int(b*255))
}

func getTuple(l, a, b float64) string {
	return fmt.Sprintf("%f,%f,%f", l*100, a*128, b*128)
}
