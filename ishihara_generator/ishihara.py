import math
import random
import sys
import argparse
import colorsys
from PIL import Image, ImageDraw, ImageFont

try:
    from scipy.spatial import cKDTree as KDTree
    import numpy as np
    IMPORTED_SCIPY = True
except ImportError:
    IMPORTED_SCIPY = False
TEXT = "TEST"
BACKGROUND = (255, 255, 255) #COLOR TO IDENTIFY BACKGROUND IN GIVE IMAGE FOR PATTERN
TOTAL_CIRCLES = 1500
color = lambda c: ((c >> 16) & 255, (c >> 8) & 255, c & 255) #HEX TO RGB

#COLORS OF THE PATTERN
COLORS_ON = [
    color(0xd7ed5a)
]
#COLORS OF THE BACKGROUND
COLORS_OFF = [
    color(0xede05a)
]

def createImage(text,size=500,fontSize=200):
    width = size
    height = width
    txt = Image.new('RGB', (width, height), (255,255,255))
    font = ImageFont.truetype("./Sansus Webissimo-Regular.ttf", fontSize)
    txtContext = ImageDraw.Draw(txt)
    textSize = txtContext.textsize(text,font)
    txtContext.text(((width-textSize[0])/2,(height-textSize[1])/2),text,font=font,fill="black")
    return txt

def generate_circle(image_width, image_height, min_diameter, max_diameter):
    radius = random.triangular(min_diameter, max_diameter,
                               max_diameter * 0.8 + min_diameter * 0.2) / 2

    angle = random.uniform(0, math.pi * 2)
    distance_from_center = random.uniform(0, image_width * 0.48 - radius)
    x = image_width  * 0.5 + math.cos(angle) * distance_from_center
    y = image_height * 0.5 + math.sin(angle) * distance_from_center

    return x, y, radius


def overlaps_motive(image, (x, y, r)):
    points_x = [x, x, x, x-r, x+r, x-r*0.93, x-r*0.93, x+r*0.93, x+r*0.93]
    points_y = [y, y-r, y+r, y, y, y+r*0.93, y-r*0.93, y+r*0.93, y-r*0.93]

    for xy in zip(points_x, points_y):
        if image.getpixel(xy)[:3] != BACKGROUND:
            return True

    return False


def circle_intersection((x1, y1, r1), (x2, y2, r2)):
    return (x2 - x1)**2 + (y2 - y1)**2 < (r2 + r1)**2

def randomize

def circle_draw(draw_image, image, (x, y, r)):
    fill_colors = COLORS_ON if overlaps_motive(image, (x, y, r)) else COLORS_OFF
    fill_color = random.choice(fill_colors)

    rgbColor = color(int(fill_color.split(":")[0],16))
    variation = int(fill_color.split(":")[1],10)

    hlsColor = rgb_to_hls(rgbColor[0],rgbColor[1],rgbColor[2])
    #generate each RGB component from X-(RANDMAX) to X+(RANDMAX)
    randomize = lambda x : int((x + (random.random()*(variation*2)) - variation)) & 255

    randomizedColor = tuple(map(,rgbColor))

    draw_image.ellipse((x - r, y - r, x + r, y + r),
                       fill=randomizedColor,
                       outline=randomizedColor)

def parseBkgColors(backgroundColors):
    global COLORS_OFF
    COLORS_OFF = backgroundColors
    print "COLORS_OFF " + repr(COLORS_OFF)

def parsePttColors(patternColors):
    global COLORS_ON
    COLORS_ON = patternColors
    print "COLORS_ON " + repr(COLORS_ON)

def parsePattern(pattern):
    global TEXT
    if pattern is not None:
        TEXT = pattern
    print "TEXT " + repr(TEXT)


def parseParam():
    parser = argparse.ArgumentParser(description='Generate Ishihara plate given colors and a pattern')

    parser.add_argument('-bkgc', type=str, action='append', required=True,
                        help='Background color/s. Format HEX:VARIATION, where HEX is the color and VARIATION is an intenger to be the MAX variation of each RGB component')
    parser.add_argument('-pttc', type=str, action='append', required=True,
                        help='Pattern color/s. Format HEX:VARIATION, where HEX is the color and VARIATION is an intenger to be the MAX variation of each RGB component')
    parser.add_argument('--pattern', type=str, help='Text to display')
    args = vars(parser.parse_args())
    parseBkgColors(args["bkgc"])
    parsePttColors(args["pttc"])
    parsePattern(args["pattern"])

def main():
    parseParam()
    image = createImage(TEXT)
    image2 = Image.new('RGB', image.size, BACKGROUND)
    draw_image = ImageDraw.Draw(image2)

    width, height = image.size

    min_diameter = (width + height) / 200
    max_diameter = (width + height) / 75

    circle = generate_circle(width, height, min_diameter, max_diameter)
    circles = [circle]

    circle_draw(draw_image, image, circle)

    try:
        for i in xrange(TOTAL_CIRCLES):
            tries = 0
            if IMPORTED_SCIPY:
                kdtree = KDTree([(x, y) for (x, y, _) in circles])
                while True:
                    circle = generate_circle(width, height, min_diameter, max_diameter)
                    elements, indexes = kdtree.query([(circle[0], circle[1])], k=12)
                    for element, index in zip(elements[0], indexes[0]):
                        if not np.isinf(element) and circle_intersection(circle, circles[index]):
                            break
                    else:
                        break
                    tries += 1
            else:
                while any(circle_intersection(circle, circle2) for circle2 in circles):
                    tries += 1
                    circle = generate_circle(width, height, min_diameter, max_diameter)

            print '{}/{} {}'.format(i, TOTAL_CIRCLES, tries)

            circles.append(circle)
            circle_draw(draw_image, image, circle)
    except (KeyboardInterrupt, SystemExit):
        pass

    image2.show()

if __name__ == '__main__':
    main()
