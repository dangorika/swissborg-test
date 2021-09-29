import Swiper from 'swiper/dist/js/swiper';
import { BREAKPOINTS } from './../_globals';

export default class Logos {
  constructor(el) {
    this.el = $(el);
    this.slider_1 = this.el.find('.swiper-container')[0];
    this.slider_2 = this.el.find('.swiper-container')[1];
  }

  init() {
    // this._testScreen(BREAKPOINTS.tablet);
    // BREAKPOINTS.tablet.addListener(this._testScreen.bind(this));

    this.instance_1 = new Swiper(this.slider_1, this._getOptions());
    this.instance_2 = new Swiper(this.slider_2, this._getOptions());

    this.instance_1.controller.control = this.instance_2;
    this.instance_2.controller.control = this.instance_1;
  }

  _getOptions() {
    return {
      slidesPerView: 4,
      speed: 600,
      autoplay: true,
      loop: true,
      preloadImages: false,
      lazy: {
        elementClass: 'lazy',
      },
      breakpoints: {
        1023: {
          slidesPerView: 2,
          slidesPerColumn: 2,
          loop: false,
          autoplay: {
            stopOnLastSlide: true
          }
        },
        767: {
          slidesPerView: 1,
          slidesPerColumn: 2,
          loop: false,
          autoplay: {
            stopOnLastSlide: true
          }
        }
      }
    };
  }

  // _testScreen(point) {
  //   if (point.matches) {
  //     if (this.instance_1 && this.instance_2) {
  //       this.instance_1.destroy(true, true);
  //       this.instance_2.destroy(true, true);

  //       this.instance_1 = null;
  //       this.instance_2 = null;
  //     }
  //   }
  //   else {
  //     if (!this.instance_1 && !this.instance_2) {
  //       this.instance_1 = new Swiper(this.slider_1, this._getOptions());
  //       this.instance_2 = new Swiper(this.slider_2, this._getOptions());

  //       this.instance_1.controller.control = this.instance_2;
  //       this.instance_2.controller.control = this.instance_1;
  //     }
  //   }
  // }
}
