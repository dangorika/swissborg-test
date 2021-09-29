import Swiper from 'swiper/dist/js/swiper';

export default class Roadmap {
  constructor(roadmap) {
    this.roadmap = $(roadmap);
    this.prevEl = $('.js-roadmap-prev');
    this.nextEl = $('.js-roadmap-next');
    this.initialSlide = this.roadmap.data('initial-slide');
  }

  init() {
    this.slider = new Swiper(this.roadmap, this._getOptions());
  }

  _getOptions() {
    return {
      slidesPerView: 'auto',
      speed: 600,
      centeredSlides: true,
      initialSlide: this.initialSlide + 1,
      navigation: {
        prevEl: this.prevEl,
        nextEl: this.nextEl,
      },
      breakpoints: {
        1023: {
          slidesPerView: 2,
          initialSlide: 0,
          centeredSlides: false
        },
        767: {
          slidesPerView: 1,
          initialSlide: 0,
          centeredSlides: false
        }
      }
    };
  }
}
