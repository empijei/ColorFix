//alternatively: https://gist.github.com/richard-to/10017943
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xmu/WinUtil.h> 
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
static Display *disp;
static Window root;

typedef struct _pixel {
	unsigned char red;
	unsigned char green;
	unsigned char blue;
} pixel;

typedef struct _screenshot {
	unsigned short width;
	unsigned short height;
	pixel *data;
} screenshot;

int init() {
	disp = XOpenDisplay(NULL);
	root = DefaultRootWindow(disp);
}

int cleanup() {
	XCloseDisplay(disp);
}

Window get_toplevel_parent(Display * display, Window window)
{
	Window parent;
	Window root;
	Window * children;
	unsigned int num_children;

	while (1) {
		if (0 == XQueryTree(display, window, &root,
					&parent, &children, &num_children)) {
			fprintf(stderr, "XQueryTree error\n");
			/*abort(); //change to whatever error handling you prefer*/
			exit(1);
		}
		if (children) { //must test for null
			XFree(children);
		}
		if (window == root || parent == root) {
			return window;
		}
		else {
			window = parent;
		}
	}
}

Window get_focus_window(Display* d, Window* w){
	int revert_to;
	Bool xerror;
	printf("getting input focus window ... ");
	XGetInputFocus(d, w, &revert_to); // see man
	if(xerror){
		printf("fail\n");
		exit(1);
	}else if(w == None){
		printf("no focus window\n");
		exit(1);
	}else{
		printf("success (window: %d)\n", (int)*w);
	}
}

int capture() {
		XWindowAttributes attr;
		Window w;
		get_focus_window(disp,&w);
		while(1){
		w=get_toplevel_parent(disp,w);

		XGetWindowAttributes(disp, w, &attr);

		screenshot *img = (screenshot *) malloc(sizeof(screenshot));
		img->width = attr.width;
		img->height = attr.height;
		img->data = malloc(attr.width * attr.height * sizeof(pixel));

		int width=attr.width;
		int height=attr.height;
		printf("%d %d\n", width,height);
		XMapWindow(disp,w);
		XImage *ximg = XGetImage(disp, w, 0, 0, width, height, AllPlanes, ZPixmap);

		unsigned long red_mask = ximg->red_mask;
		unsigned long green_mask = ximg->green_mask;
		unsigned long blue_mask = ximg->blue_mask;

		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height ; y++) {
				unsigned long xpixel = 0;
				XPutPixel(ximg, x, y,xpixel);
			}
		}

		/*for (int x = 0; x < width; x++) {*/
		/*for (int y = 0; y < height ; y++) {*/
		/*unsigned long xpixel = XGetPixel(ximg, x, y);*/

		/*pixel *pixel = &(img[y * x]);*/
		/*pixel->red = (xpixel & red_mask) >> 16;*/
		/*pixel->green = (xpixel & green_mask) >> 8;*/
		/*pixel->blue = xpixel & blue_mask;*/
		/*}*/
		/*}*/

		GC gc = XCreateGC(disp,w,0,NULL);

		XPutImage(disp, w, gc, ximg, 0,0,0,0, width, height);
	}
}

int main(){
	setbuf(stdout,NULL);
	init();
	return capture();
}
