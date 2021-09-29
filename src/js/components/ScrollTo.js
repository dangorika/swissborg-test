import { HTMLBODY, G } from './../_globals';

export default class ScrollTo {
  constructor() {
    this.url = $('a');
  }

  init() {
    this.url.on('click', this._onClick.bind(this));
  }

  _onClick(e) {
    const url = e.currentTarget.getAttribute('href');

    if (/^#/.test(url) === true) {
      if(url.length <= 1) return;

      G.isScrolling = true;
      HTMLBODY.animate({
        scrollTop: $(url).offset().top
      }, 700,
      () => {
        G.isScrolling = false;
      });
    }
  }
}
