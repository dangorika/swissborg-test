export default class GetImage {
  constructor(url) {
    this.size = 200;
    // this.size = 80;
    this.url = url;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.classList.add('tempcanvas');
    document.body.appendChild(this.canvas);


  }

  getData() {
    return new Promise((resolve, reject) => {
      let that = this;
      this.img = new Image;
      this.img.onload = function() {
			  resolve(that.getArrayFromImage(that.img));
      };
      this.img.src = this.url;
    });
  }



  getArrayFromImage(img) {
    let imageCoords = [];
    this.ctx.clearRect(0,0,this.size,this.size);
	    this.ctx.drawImage(img, 0, 0, this.size, this.size);
	    this.data = this.ctx.getImageData(0, 0, this.size, this.size);
	    let data = this.data.data;
	    for(var y = 0; y < this.size; y++) {
	      for(var x = 0; x < this.size; x++) {
	        var red = data[((this.size * y) + x) * 4];
	        var green = data[((this.size * y) + x) * 4 + 1];
	        var blue = data[((this.size * y) + x) * 4 + 2];
	        var alpha = data[((this.size * y) + x) * 4 + 3];
	        if(red<10) {
	        	imageCoords.push([2*(x - this.size/2)/this.size,2*(this.size/2 - y)/this.size]);
	        }
	      }
	    }
	    return imageCoords;
  }
}
