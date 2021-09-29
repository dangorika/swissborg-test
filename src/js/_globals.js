export const DOC = $(document);
export const WIN = $(window);
export const BODY = $('body');
export const HTMLBODY = $('html, body');
export let BREAKPOINTS = {
  tablet: window.matchMedia('(max-width: 1023px)'),
  mobile: window.matchMedia('(max-width: 767px)')
};

export let CLASSES = {
  active: 'is-active',
  modalOpen: 'is-modal-open',
  visible: 'is-visible',
  fixed: 'is-fixed'
};

class Global {
  constructor() {
    this.RAF;
    this.isHome = $('.home').length !== 0;
    this.isArticle = $('.js-white-layout').length !== 0;

    this.mountainGroups = [];
    this.WAVES = [];
    this.isAnimating = false;
  }
}

export let G = new Global();

