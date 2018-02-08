function circleSmoothing(x,xs,ys){
		//TODO rethink about a max length for the curve....
		//TODO insert switch for adjust precision, to make it more lightweight if necessary
		var i = 1;
		while(xs[i]<x) i++;
		// x in [ xs[i-1], xs[i] ]
    //find y in the line connecting the previous and next points
    var m = (ys[i]-ys[i-1])/(xs[i]-xs[i-1])
    var q = (xs[i]*ys[i-1] - xs[i-1]*ys[i])/(xs[i]-xs[i-1])
    var linearY = m*x + q
    var k = calculateMaxK(xs,ys);
    // //console.log("K :="+k);
    //detect if we are leaving a point, in the middle, or arriving to the next
    var prevDistance = calculateDistance(x,linearY,xs[i-1],ys[i-1]);
    var nextDistance = calculateDistance(x,linearY,xs[i],ys[i]);

		//center part of the segment
		if(prevDistance>=k && nextDistance>=k){
			return linearY;
		} else if(prevDistance<k && (i == 1)){ // leaving 0
      return linearY;
    } else if(nextDistance<k && (i == xs.length-1)){ // arriving to 1
			return linearY;
		}
    if(prevDistance<k){
      //leaving a point
      //i becomes the center of the 3 points I am considering
      i -= 1;
    }
		//console.log("Current x : "+x)
		//console.log("Current b : "+i)
		//console.log("linearY :="+linearY);
    //a = point i-1
    //b = point i
    //c = point i+1
    //need to calculate the points which distance
    //from b is k on the lines a-b and b-c
    // d on ab
    // e on bc
    //and then find the intersection of the perpendicular in a and c
    //which is going to be the center
    // f center
    var d = getPointOnLine(xs[i],ys[i],xs[i-1],ys[i-1],k,-1);
    var e = getPointOnLine(xs[i],ys[i],xs[i+1],ys[i+1],k,+1);
		//console.log("distance d "+calculateDistance(d[0],d[1],xs[i],ys[i]));
		//console.log("distance e "+calculateDistance(e[0],e[1],xs[i],ys[i]));
    var Mab = ( ys[i]   - ys[i-1] ) / ( xs[i]   - xs[i-1] )
    var Mbc = ( ys[i+1] - ys[i]   ) / ( xs[i+1] - xs[i]   )
    var Mdf = -1/Mab
    var Mef = -1/Mbc
    var Qdf = -Mdf*d[0] + d[1]
    var Qef = -Mef*e[0] + e[1]
		plotLine(Mdf,Qdf);
		plotLine(Mef,Qef);
    //using the as the second point the one with x == 0
    var f = line_intersect(d[0],d[1],1,Mdf+Qdf,e[0],e[1],1,Mef+Qef);
    var radius = calculateDistance(f[0],f[1],d[0],d[1]);
		var radius2 = calculateDistance(f[0],f[1],e[0],e[1]);
		//console.log("Center to d "+radius+"; Center to e "+radius2);
		//console.log("d "+d);
		//console.log("e "+e);
		//console.log("f "+f);
		var debugd = line_intersect(d[0],d[1],f[0],f[1],xs[i-1],ys[i-1],xs[i],ys[i]);
		var debuge = line_intersect(e[0],e[1],f[0],f[1],xs[i],ys[i],xs[i+1],ys[i+1]);
		//console.log("Should be d "+debugd);
		//console.log("Should be e "+debuge);

		var circlePart = 0;
    if(Mab< Mbc){
      circlePart = -1;//e since we are leaving
    } else {
      circlePart = 1;//d since we are arriving to b
    }
    var circleY = getPointOnCircle(x,f,radius,circlePart)
    return circleY;
}
var plotted = []
function plotLine(m,q){
	for(i in plotted){
		if(plotted[i].m == m && plotted[i].q == q){
			return;
		}
	}
	plotted = plotted.concat({m:m,q:q});
	var precision = 1000;
	var line = {
		x: [],
		y: [],
		type: 'scatter'
	};
	for(var i = 0;i<=precision;i++){
		line.x = line.x.concat(i/precision);
		line.y = line.y.concat(m*(i/precision)+q);
	}
	Plotly.addTraces('plot', line);
}

function getPointOnCircle(x,center,radius,direction){
  direction= direction/Math.abs(direction);
  var y = center[1]+ direction * Math.sqrt( radius**2 - (x - center[0])**2 );
  return y;
}

function line_intersect(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return [result.x,result.y];
};


//return the point in the direction selected, disting dist from x0,y0 on
//the line between x0,y0 and x1,y1
function getPointOnLine(x0,y0,x1,y1,dist,direction){
  var vx = Math.abs(x1 -x0);
  var vy = Math.abs(y1- y0);
  var len = Math.sqrt(vx**2 + vy**2);
  vx = vx/len;
  vy = vy/len;
  direction= direction/Math.abs(direction);
  return [x0+dist*vx*direction,y0+dist*vy*direction]
}


function calculateDistance(x0,y0,x1,y1){
  return Math.sqrt(Math.abs(x0-x1)**2+Math.abs(y0-y1)**2);
}

function calculateMaxK(xs,ys){

  var minDistance = 1;
  for(var i = 1;i<xs.length; i++){
    var d = calculateDistance(xs[i-1],ys[i-1],xs[i],ys[i]);
    if(d<minDistance){
      minDistance = d;
    }
  }
  return minDistance/2;
}
