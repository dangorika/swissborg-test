import { TimelineLite } from 'gsap/TweenLite';
import './../lib/gsapArray';

import { G } from './../_globals';

export default class Mountain {
  constructor(ctx, width, height, dpi, data, index, count) {
    this.dpi = dpi;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.ctx = ctx;
    this.index = index;
    this.count = count;

    this.gradient = data.gradient;
    this.color_0 = data.color_0;
    this.color_1 = data.color_1;

    this.points = data.points;
    this.endX = [];
    this.endY = [];
    this.startY = [];
  }

  init() {
    this._generatePoints();
    this.animate();
  }

  update() {
    this.draw(this.startY, this.endX);
  }


  animate() {
    G.tl.add(TweenLite.to(this.startY, (this.count-this.index+(this.count*0.8))*0.25, {
      endArray: this.endY, ease: Power4.easeInOut
    }), (this.count - (this.index))*0.1);
  }

  _generatePoints() {
    this.points.forEach(p => {
      this.endX.push(p[0]*this.dpi);
      this.endY.push(p[1]*this.dpi);
      this.startY.push(this.canvasHeight);
    });
  }

  draw(pointsY, pointsX) {

    this.ctx.beginPath();
    this.ctx.moveTo(pointsX[0], pointsY[0]);

    for (var i = 1; i < pointsX.length-2; i++) {
      let c = (pointsX[i] + pointsX[i+1])/2;
      let d = (pointsY[i]+pointsY[i+1])/2;
      this.ctx.quadraticCurveTo(pointsX[i], pointsY[i], c, d);
    }

    // For the last 2 points
    this.ctx.quadraticCurveTo(
      pointsX[i],
      pointsY[i],
      pointsX[i+1],
      pointsY[i+1]
    );


    if (this.gradient) {
      const g = this.ctx.createLinearGradient(this.gradient.x0*this.dpi, this.gradient.y0*this.dpi, this.gradient.x1*this.dpi, this.gradient.y1*this.dpi);
      g.addColorStop(0, this.color_0);
      g.addColorStop(1, this.color_1);
      this.ctx.fillStyle = g;

      this.ctx.lineTo(0, this.gradient.y1*this.dpi);
      this.ctx.lineTo(this.canvasWidth, this.gradient.y1*this.dpi);
    }
    else {
      this.ctx.fillStyle = this.color_0;
      this.ctx.lineTo(0, this.canvasHeight);
      this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
    }

    this.ctx.closePath();
    this.ctx.fill();
  }
}
