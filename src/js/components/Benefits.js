import Swiper from 'swiper/dist/js/swiper';
import { BREAKPOINTS } from './../_globals';

export default class Benefits {
  constructor(el) {
    this.el = $(el);
    this.prevEl = $('.js-benefits-prev');
    this.nextEl = $('.js-benefits-next');
  }

  init() {
    if (!this.slider) this.slider = new Swiper(this.el, this._getOptions());
    // this._testScreen(BREAKPOINTS.tablet);
    // BREAKPOINTS.tablet.addListener(this._testScreen.bind(this));
  }

  _getOptions() {
    return {
      slidesPerView: 3,
      speed: 600,
      watchOverflow: true,
      spaceBetween: 48,
      navigation: {
        prevEl: this.prevEl,
        nextEl: this.nextEl,
      },
      breakpoints: {
        767: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        1023: {
          slidesPerView: 2,
          spaceBetween: 39
        }
      }
    };
  }

  _testScreen(point) {
    if (point.matches) {
      if (!this.slider) this.slider = new Swiper(this.el, this._getOptions());
    }
    else {
      if (this.slider) this.slider.destroy(true, true);
      this.slider = null;
    }
  }
}
