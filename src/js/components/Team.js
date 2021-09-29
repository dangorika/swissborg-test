import Swiper from 'swiper/dist/js/swiper';

export default class Team {
  constructor(team) {
    this.team = $(team);
  }

  init() {
    this.slider = new Swiper(this.team, this._getOptions());
  }

  _getOptions() {
    return {
      speed: 600,
      loop: true,
      autoplay: true,
      slidesPerView: 4,
      spaceBetween: 48,
      preloadImages: false,
      lazy: {
        elementClass: 'lazy',
      },
      breakpoints: {
        1023: {
          slidesPerView: 2
        },
        767: {
          slidesPerView: 1
        }
      }
    };
  }
}
