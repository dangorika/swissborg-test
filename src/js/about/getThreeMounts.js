import {topLine, midLine, botLine} from './data200.js';


class GetPath {

  constructor() {

    this.debug = false;
    this.color = 'black';
    this.element = document.createElement('canvas');
    this.size = 200;
    this.element.width = this.size;
    this.element.height = this.size;
    this.element.classList.add('hiddencanvas');
    this.ctx = this.element.getContext('2d');
    // document.body.appendChild(this.element);
    this.draw();
  }
  draw() {
    let that = this;
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    // this.ctx.fillStyle = '#ffffff';
    // this.ctx.fillRect(0,0,this.element.width,this.element.height);
    // this.ctx.fillStyle = '#FF0000';
    // this.ctx.fillRect(10,10,24,24);

    let shift = 0;
    let third = this.size/3;
    botLine.forEach((el,i) => {
      that.ctx.fillStyle = 'rgba(0,0,0,'+el[1]/700+')';
      that.ctx.fillRect(i,shift,1,third);
    });

    shift += third;

    midLine.forEach((el,i) => {
      that.ctx.fillStyle = 'rgba(0,0,0,'+el[1]/700+')';
      that.ctx.fillRect(i,shift,1,third);
    });

    shift += third;

    topLine.forEach((el,i) => {
      that.ctx.fillStyle = 'rgba(0,0,0,'+el[1]/700+')';
      that.ctx.fillRect(i,shift,1,third);
      // console.log(el[1]/500,el[1]);
    });
  }
}


export default GetPath;
