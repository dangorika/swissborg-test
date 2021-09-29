import { WIN, G } from './../_globals';
import { DATAHOME, DATAPAGE } from './_data';
import Mountain from './Mountain';

export default class Mountains {
  constructor(group) {
    this.dpi = window.devicePixelRatio;

    this.group = $(group);
    this.data = G.isHome ? DATAHOME[0] : DATAPAGE[0];

    this.mountainElements = [];
  }

  init() {
    this._initCanvas();
    this._initMountains();
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this._updateMountains();
  }

  _initCanvas() {
    this.canvas = this.group.find('.js-mountains-canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    this.canvasHeight = this.canvas.height*this.dpi;
    this.canvasWidth = this.canvas.width*this.dpi;

    this._fixdpi();
  }

  _initMountains() {
    console.log(this.data.length);
    this.data.forEach((data, i) => {
      const mountain = new Mountain(this.ctx, this.canvasWidth, this.canvasHeight, this.dpi, data, i, this.data.length);

      this.mountainElements.push(mountain);
      mountain.init();
    });
  }

  _fixdpi() {
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
  }

  _updateMountains() {
    this.mountainElements.forEach(el => el.update());
  }

  // _animateMountains() {
  //   this.mountainElements.forEach((el, index) => el.animate(0.25*(this.mountainElements.length-index+1)));
  // }
}
