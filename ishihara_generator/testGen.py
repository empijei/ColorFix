import subprocess
import copy
import os
import random
from math import sqrt
from colormath.color_objects import LabColor, sRGBColor, HSVColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000



color = lambda c: ((c >> 16) & 255, (c >> 8) & 255, c & 255) #HEX TO RGB
getLightLinear = lambda x : x[0] * 0.2126 + x[1] * 0.7152 + x[2] * 0.0722
getLight255 = lambda x : x[0]*x[0] * 0.241 + x[1]*x[1] * 0.691 + x[2]*x[2] * 0.068
getLight1 = lambda x : getLight255(RGBto255(x))
RGBto255 = lambda x : (x[0] * 255, x[1] * 255, x[2] * 255)
RGBto1 =lambda x : (x[0] / 255.0, x[1] / 255.0, x[2] / 255.0)
RGBtoLightUpscale = lambda x,k : (x[0] *sqrt(k), x[1] *sqrt(k), x[2] *sqrt(k))

def sComponentToLinear(component):
    if(component<=0.04045):
        return component/12.92
    else:
        return ((component+0.055)/(1+0.055))**2.4

def linearComponentToS(component):
    if(component<=0.0031308):
        return component*12.92
    else:
        return ((1+0.055)*(component**(1/2.4)) - 0.055)

def sRGBtoLinearRGB(sRGBtuple):
    return tuple(map(sComponentToLinear,sRGBtuple))

def linearRGBtoSRGB(linearRGBtuple):
    return tuple(map(linearComponentToS,linearRGBtuple))

def normalizedToLow1(colorLeft,colorRight):
    leftLight = getLight1(colorLeft.get_value_tuple())
    rightLight = getLight1(colorRight.get_value_tuple())
    normalizedLeft = copy.deepcopy(colorLeft)
    normalizedRight = copy.deepcopy(colorRight)
    if leftLight<rightLight:
        k = leftLight/rightLight
        old = RGBto255(normalizedRight.get_value_tuple())
        new = RGBtoLightUpscale(old,k)
        newScaled = RGBto1(new)
        normalizedRight.rgb_r = newScaled[0]
        normalizedRight.rgb_g = newScaled[1]
        normalizedRight.rgb_b = newScaled[2]
        print "Edited right"
    else:
        k = rightLight/leftLight
        old = RGBto255(normalizedLeft.get_value_tuple())
        new = RGBtoLightUpscale(old,k)
        newScaled = RGBto1(new)
        normalizedLeft.rgb_r = newScaled[0]
        normalizedLeft.rgb_g = newScaled[1]
        normalizedLeft.rgb_b = newScaled[2]
        print "Edited left"
    print "Pre normalization", getLight1(colorLeft.get_value_tuple()),getLight1(colorRight.get_value_tuple())
    print "Post normalization", getLight1(normalizedLeft.get_value_tuple()),getLight1(normalizedRight.get_value_tuple())
    return normalizedLeft,normalizedRight

def checkYellow():
    print "Testing yellow:"
    yellow = HSVColor(60.0, 1, 1)
    colorRightHSV = copy.deepcopy(yellow)
    colorLeftHSV = copy.deepcopy(yellow)
    i = 0
    k = 0.5
    while True:
        if (yellow.hsv_h + i*k > 360) or (yellow.hsv_h + i*k < 0):
            break
        colorLeftHSV.hsv_h = yellow.hsv_h - i*k
        colorRightHSV.hsv_h = yellow.hsv_h + i*k

        colorLeft = convert_color(colorLeftHSV, sRGBColor)
        colorRight = convert_color(colorRightHSV, sRGBColor)

        normalizedLeft,normalizedRight = normalizedToLow1(colorLeft,colorRight)
        background = sRGBColor(1,1,1)
        background, _ = normalizedToLow1(background,normalizedLeft)

        left = sRGBColor.get_rgb_hex(normalizedLeft)
        right = sRGBColor.get_rgb_hex(normalizedRight)
        left = "0x"+left[1:]
        right = "0x"+right[1:]
        back = sRGBColor.get_rgb_hex(background)
        back = "0x"+back[1:]
        number = random.choice(range(10))
        command = "python ishihara.py -bkgc {}:0 -pttc {}:0 --pattern {} ".format(left,right,number)
        os.system(command)
        print "Which number (0-9 or none): "
        choice = raw_input()
        i += 1
        try:
            if number == int(choice,10):
                print "Correct, edge : {} {}".format(left,right)
                print "H left {}, H right {}".format(colorLeftHSV.hsv_h,colorRightHSV.hsv_h)
                return
            else:
                continue
        except:
            continue
    print "No hope for you!"

def checkColor(hue,step):
    print "Testing hue {}:".format(hue)
    startColor = HSVColor(hue, 1, 1)
    colorRightHSV = copy.deepcopy(startColor)
    colorLeftHSV = copy.deepcopy(startColor)
    i = 0
    k = step
    while True:
        if (startColor.hsv_h + i*k > 360) or (startColor.hsv_h + i*k < 0):
            break
        #colorLeftHSV.hsv_h = startColor.hsv_h - i*k
        colorRightHSV.hsv_h = startColor.hsv_h + i*k

        colorLeft = convert_color(colorLeftHSV, sRGBColor)
        colorRight = convert_color(colorRightHSV, sRGBColor)

        normalizedLeft,normalizedRight = normalizedToLow1(colorLeft,colorRight)
        background = sRGBColor(1,1,1)
        background, _ = normalizedToLow1(background,normalizedLeft)

        left = sRGBColor.get_rgb_hex(normalizedLeft)
        right = sRGBColor.get_rgb_hex(normalizedRight)
        left = "0x"+left[1:]
        right = "0x"+right[1:]
        back = sRGBColor.get_rgb_hex(background)
        back = "0x"+back[1:]
        number = random.choice(range(10))
        command = "python ishihara.py -bkgc {}:0 -pttc {}:0 --pattern {} ".format(left,right,number)
        os.system(command)
        print "Which number (0-9 or none): "
        choice = raw_input()
        i += 1
        try:
            if number == int(choice,10):
                print "Correct, edge : {} {}".format(left,right)
                print "H left {}, H right {}".format(colorLeftHSV.hsv_h,colorRightHSV.hsv_h)
                return
            else:
                continue
        except:
            continue
    print "No hope for you!"


def checkYellow2():
    colors =[("#CBCC11", "#CBCC11"),
            ("#C8CD11", "#CFCA11"),
            ("#C4CE11", "#D3C911"),
            ("#C1CF11", "#D6C812"),
            ("#BDD011", "#DAC712"),
            ("#BAD111", "#DEC612"),
            ("#B6D211", "#E1C512"),
            ("#B3D311", "#E5C412"),
            ("#AFD411", "#E9C312"),
            ("#ACD511", "#ECC212"),
            ("#A9D611", "#F0C112"),
            ("#A5D711", "#F4BF12"),
            ("#A2D811", "#F8BE12"),
            ("#9ED911", "#FBBD12"),
            ("#83BE0A", "#DEA20C"),
            ("#80BE0A", "#E1A10C"),
            ("#7DBF0A", "#E5A00C"),
            ("#7AC00A", "#E89F0C"),
            ("#77C10A", "#EC9E0C"),
            ("#74C20A", "#EF9D0C"),
            ("#71C30A", "#F39C0C"),
            ("#6EC40A", "#F69B0C"),
            ("#6BC50A", "#FA9A0C"),
            ("#69C50A", "#FD990C"),
            ("#53AC05", "#DF8207"),
            ("#51AC05", "#E28107"),
            ("#4EAD05", "#E68007"),
            ("#4CAE05", "#E97F07"),
            ("#49AF04", "#EC7E07"),
            ("#47AF04", "#F07D07"),
            ("#44B004", "#F37C07"),
            ("#42B104", "#F67B07"),
            ("#3FB204", "#FA7A07"),
            ("#3DB204", "#FD7908"),
            ("#2D9A00", "#DE6503"),
            ("#2B9A00", "#E16403"),
            ("#299B00", "#E46304"),
            ("#279C00", "#E76204"),
            ("#259C00", "#EB6104")]
    print "Testing yellow:"
    for i in colors:
        print i
        left = "0x"+i[0][1:]
        right = "0x"+i[1][1:]

        ###
        intLeft = color(int(left,16))
        intRight = color(int(right,16))
        print getLight255(intLeft),getLight255(intRight)
        ###

        number = random.choice(range(10))
        command = "python ishihara.py -bkgc {}:1 -pttc {}:1 --pattern {} ".format(left,right,number)
        #print command
        os.system(command)
        print "Which number (0-9 or none): "
        choice = raw_input()

        try:
            if number == int(choice,10):
                print "Correct, edge : {} {}".format(left,right)
                return
            else:
                continue
        except:
            continue
    print "No hope for you!"


def main():
    # checkYellow()
    # checkColor(60.0, +5.0) #yellow
    # checkColor(60.0, -5.0) #yellow
    # checkColor(240.0, +5.0)
    checkColor(300.0, -5.0)

if __name__ == '__main__':
    main()



    # labLeft = convert_color(colorLeft,LabColor)
    # labRight = convert_color(colorRight,LabColor)
    # print labLeft
    # print labRight
    # average = (labLeft.lab_l + labRight.lab_l) / 2.0
    # labLeft.lab_l = average
    # labRight.lab_l = average
    # print labLeft
    # print labRight
    # normalizedLeft = convert_color(labLeft,sRGBColor)
    # normalizedRight = convert_color(labRight,sRGBColor)
    # left = sRGBColor.get_rgb_hex(normalizedLeft)
    # right = sRGBColor.get_rgb_hex(normalizedRight)
