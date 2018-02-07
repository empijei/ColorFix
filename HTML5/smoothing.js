function circleSmoothing(x,xs,ys,k){
		var i = 1;
		while(xs[i]<x) i++;
		// x in [ xs[i-1], xs[i] ]
    //find y in the line connecting the previous and next points
    var linearY = ((xs[i]-xs[i-1])/(ys[i]-ys[i-1]))*x

    k = calculateMaxK(xs,ys);

    //detect if we are leaving a point, in the middle, or arriving to the next
    var prevDistance = calculateDistance(x,linearY,xs[i-1],ys[i-1]);
    var nextDistance = calculateDistance(x,linearY,xs[i],ys[i]);



    if(prevDistance>=k || nextDistance>=k){
      return linearY;
    }
    if(prevDistance<k){
      //leaving a point
      //i becomes the center of the 3 points I am considering
      i -= 1;
    }
    //manages first and last points
    if(i<1 || i>=xs.length-1){
      //maybe is going to work
      return linearY;
    }
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
    var d = getPointOnLine(xs[i],ys[i],xs[i-1],xs[i-1],k,-1);
    var e = getPointOnLine(xs[i],ys[i],xs[i+1],xs[i+1],k,+1);
    var Mab = (xs[i]-xs[i-1])/(ys[i]-ys[i-1])
    var Mbc = (xs[i+1]-xs[i])/(ys[i+1]-ys[i])
    var Mdf = -1/Mab
    var Qdf = d[1]/(Mdf*d[0])
    var Qef = e[1]/(Mef*e[0])
    //using the as the second point the one with x == 0
    var f = line_intersect(d[0],d[1],0,Qdf,e[0],e[1],0,Qef);
    var radius = calculateDistance(f[0],f[1],d[0],d[1]);
    var circlePart = 0;
    if(prevDistance<k){
      circlePart = e[1] - f[1];//e since we are leaving
    } else {
      circlePart = d[1] - f[1];//d since we are arriving to b
    }
    var circleY = getPointOnCircle(x,f,radius,circlePart)
    return circleY;
}

function getPointOnCircle(x,center,radius,direction){
  direction= direction/Math.abs(direction);
  var y = center[1]+ direction * Math.sqrt( radius**2 - (x - center[0])**2 );
  return y;
}

function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return [x1 + ua*(x2 - x1),y1 + ua*(y2 - y1)];
}

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
