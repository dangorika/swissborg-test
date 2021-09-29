export default class Wave {
  constructor(path, data) {
    this.path = path;
    this.timing = $(this.path).data('timing');
    this.viewBox = $(this.path).closest('svg')[0].viewBox.baseVal;
    this.width = this.viewBox.width;
    this.height = this.viewBox.height;
    this.data = data;

    this.pointsX = [];
    this.pointsY = [];
  }

  init() {
    this._generateArrays();
    this._draw(this.pointsX[0], this.pointsY[0]);
    console.log(this.pointsX, this.pointsY);
    this._animate();
  }

  _generateArrays() {
    // creating separate x and y points arrays
    this.data.forEach(array => {
      let tempArrayX = [];
      let tempArrayY = [];
      array.forEach(point => {
        tempArrayX.push(point[0]);
        tempArrayY.push(point[1]);
      });

      this.pointsX.push(tempArrayX);
      this.pointsY.push(tempArrayY);
    });
  }

  _draw(pointsX, pointsY) {
    let pathD = 'M' + pointsX[0] + ',' + pointsY[0] + ' ';

    for (var i = 1; i < pointsX.length-2; i++) {
      let c = (pointsX[i] + pointsX[i+1])/2;
      let d = (pointsY[i] + pointsY[i+1])/2;
      pathD += 'Q' + pointsX[i] + ',' + pointsY[i] + ' ' + c + ',' + d;
    }
    // For the last 2 points
    pathD += 'Q' + pointsX[i] + ',' + pointsY[i] + ' ' + pointsX[i+1] + ',' + pointsY[i+1];

    pathD += 'L' + 0 + ',' + this.height;
    pathD += 'L' + this.width + ',' + this.height + 'Z';

    this.path.setAttribute('d', pathD);
  }

  _animate() {
    this.tl = new TimelineLite({ paused: true });

    this.data.forEach((point, i) => {
      if (i === this.data.length-1) return;

      if (i === 0) {
        this.tl
          .to(this.pointsX[i], this.timing*(3-(i+1)*0.25), {endArray: this.pointsX[i+1], ease: Power1.easeOut, onUpdate: () => this._draw(this.pointsX[i], this.pointsY[i])})
          .to(this.pointsY[i], this.timing*(3-(i+1)*0.25), {endArray: this.pointsY[i+1], ease: Power1.easeOut}, `-=${this.timing*(3-(i+1)*0.25)}`);
      } else {
        this.tl
          .to(this.pointsX[i], this.timing, {endArray: this.pointsX[i+1], ease: Sine.easeInOut, onUpdate: () => this._draw(this.pointsX[i], this.pointsY[i])})
          .to(this.pointsY[i], this.timing, {endArray: this.pointsY[i+1], ease: Sine.easeInOut}, `-=${this.timing}`);
      }
    });
  }

  play(cb) {
    this.tl.play();
    this.tl.eventCallback('onStart', cb);
  }
}
