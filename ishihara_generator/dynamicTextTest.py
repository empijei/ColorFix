
from PIL import Image, ImageDraw, ImageFont
def createImage(text,size=500,fontSize=200):
    width = size
    height = width
    txt = Image.new('RGB', (width, height), (255,255,255))
    font = ImageFont.truetype("./Sansus Webissimo-Regular.ttf", fontSize)
    txtContext = ImageDraw.Draw(txt)
    textSize = txtContext.textsize(text,font)
    txtContext.text(((width-textSize[0])/2,(height-textSize[1])/2),text,font=font,fill="black")
    return txt
