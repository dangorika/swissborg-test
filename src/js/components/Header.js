import { WIN, DOC, G, BODY, HTMLBODY, CLASSES, BREAKPOINTS } from './../_globals';

let SCROLL_TOP = 0;

export default class Header {
  constructor(el) {
    this.header = $(el);
    this.logo = this.header.find('.js-logo img');
    this.logoLight = this.logo.data('src-light');
    this.logoDark = this.logo.data('src-dark');
    this.burger = this.header.find('.js-burger');
    this.navItem = this.header.find('.nav__link, .lang__toggle');

    this.lastScroll = 0;
    this.scrollBack = false;

    this.isAccordionEnabled = false;

    this.fixDistance = G.isHome && !BREAKPOINTS.mobile.matches ? WIN.height() : 0;
  }

  init() {
    DOC.on('scroll', this._onScroll.bind(this));
    this.burger.on('click', this._onClick.bind(this));
    this.navItem.on('click', this._onItemClick.bind(this));
    BODY.on('click', this._onBodyClick.bind(this));

    DOC.on('mousemove', this._onMouseMove.bind(this));

    this._testTabletScreen(BREAKPOINTS.tablet);
    BREAKPOINTS.tablet.addListener(this._testTabletScreen.bind(this));

    if (G.isHome) {
      this._testMobileHomeScreen(BREAKPOINTS.mobile);
      BREAKPOINTS.mobile.addListener(this._testMobileHomeScreen.bind(this));
    }
  }


  _onScroll(e) {
    if (BODY.hasClass(CLASSES.modalOpen)) return;

    if (!BREAKPOINTS.mobile.matches) {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      this.scrollBack = st < this.lastScroll;
      this.lastScroll = st <= 0 ? 0 : st;

      if (G.isHome || G.isArticle) {
        WIN.scrollTop() - this.header.height() > this.fixDistance ? this.fixHome() : this.unfixHome();
        if (this.scrollBack && !this.header.hasClass(CLASSES.active)) {
          this.header.addClass(CLASSES.visible);
        } else {
          this.header.removeClass(CLASSES.visible);
          this._deactivate();
        }
      } else {
        WIN.scrollTop() - this.header.height() > this.fixDistance ? this.fix() : this.unfix();
        if (this.scrollBack && !this.header.hasClass(CLASSES.active)) {
          this.header.addClass(CLASSES.visible);
        } else {
          this.header.removeClass(CLASSES.visible);
          this._deactivate();
        }
      }
    }
    else {
      if (G.isArticle) {
        WIN.scrollTop() > this.fixDistance ? this.fixArticleMob() : this.unfixArticleMob();
      } else {
        WIN.scrollTop() > this.fixDistance ? this.fix() : this.unfix();
      }
    }
  }

  fix() {
    if (!this.header.hasClass(CLASSES.fixed)) this.header.addClass(CLASSES.fixed);
  }

  unfix() {
    if (this.header.hasClass(CLASSES.fixed)) this.header.removeClass(CLASSES.fixed);
  }

  fixHome() {
    if (!this.header.hasClass(CLASSES.fixed)) {
      this.header.addClass(CLASSES.fixed);
      this.header.addClass('header_dark');

      if (BREAKPOINTS.mobile.matches) return;
      this.logo.attr('src', this.logoLight);
    }
  }

  unfixHome() {
    if (this.header.hasClass(CLASSES.fixed)) {
      this.header.removeClass(CLASSES.fixed);
      this.header.removeClass('header_dark');

      if (BREAKPOINTS.mobile.matches) return;
      this.logo.attr('src', this.logoDark);
    }
  }

  fixArticleMob() {
    if (!this.header.hasClass(CLASSES.fixed)) {
      this.header.addClass(CLASSES.fixed);
      this.header.addClass('header_dark');
      this.logo.attr('src', this.logoLight);
    }
  }

  unfixArticleMob() {
    if (this.header.hasClass(CLASSES.fixed)) {
      this.header.removeClass(CLASSES.fixed);
      this.header.removeClass('header_dark');
      this.logo.attr('src', this.logoDark);
    }
  }

  _onMouseMove(e) {
    if (BODY.hasClass(CLASSES.modalOpen)) return;
    if (e.clientY <= this.header.height()) {
      if (!this.header.hasClass(CLASSES.visible) && !BREAKPOINTS.mobile.matches) {
        this.header.addClass(CLASSES.visible);
      } else {
        if (this.header.hasClass(CLASSES.active)) return;

        this.header.removeClass(CLASSES.visible);
        this._deactivate();
      }
    }
  }

  _onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    $(e.currentTarget).toggleClass(CLASSES.active);
    $(e.currentTarget).closest(this.header).toggleClass(CLASSES.active);

    if (!BODY.hasClass(CLASSES.modalOpen)) SCROLL_TOP = WIN.scrollTop();
    BODY.toggleClass(CLASSES.modalOpen);
    if (!BODY.hasClass(CLASSES.modalOpen)) {
      HTMLBODY.animate({scrollTop: SCROLL_TOP},0);
    }
    if (this.isAccordionEnabled && !BODY.hasClass(CLASSES.modalOpen)) {
      $('.subnav, .lang__list').slideUp(300);
      this.navItem.removeClass('is-open');
    }

    if (G.isHome || G.isArticle) {
      this.header.hasClass(CLASSES.active) ? this.fixHome() : this.unfixHome();
    }
  }

  _onItemClick(e) {
    if (!BREAKPOINTS.mobile.matches) return;
    e.preventDefault();
    e.stopPropagation();

    if ($(e.currentTarget).hasClass('is-open')) {
      $(e.currentTarget).removeClass('is-open');
      $('.subnav, .lang__list').slideUp(300);
      return;
    } else {
      this.navItem.removeClass('is-open');
      $(e.currentTarget).addClass('is-open');
      $('.subnav, .lang__list').slideUp(300);
      $(e.currentTarget).next('.subnav, .lang__list').slideDown(300);
    }

    // if ($(e.currentTarget).hasClass('lang__toggle')) return;
    // this._deactivate();
  }

  _onBodyClick(e) {
    if ($(e.target).closest('.subnav').length !== 0) return;
    if (!BODY.hasClass(CLASSES.modalOpen)) return;
    e.preventDefault();
    this.navItem.removeClass('is-open');
    $('.subnav, .lang__list').slideUp(300);
  }

  _enableAccordion() {
    $('.subnav, .lang__list').slideUp(300);
    this.isAccordionEnabled = true;
  }

  _disableAccordion() {
    $('.subnav, .lang__list').removeAttr('style');
    this.isAccordionEnabled = false;
  }

  _deactivate() {
    this.burger.removeClass(CLASSES.active);
    this.header.removeClass(CLASSES.active);
    BODY.removeClass(CLASSES.modalOpen);

    if (G.isHome) {
      if (WIN.scrollTop() - this.header.height() > this.fixDistance) {
        this.logo.attr('src', this.logoLight);
      }
      else {
        this.unfixHome();
      }

    }
  }

  _testMobileHomeScreen(point) {
    if (point.matches) {
      this.logo.attr('src', this.logoLight);
    }
    else {
      this.logo.attr('src', this.logoDark);
    }
  }

  _testTabletScreen(point) {
    if (point.matches) {
      this._enableAccordion();
    }
    else {
      this._disableAccordion();
      this._deactivate();
    }
  }
}






// THIS IS TEMPORARY VERSION OF HEADER FOR CURRENT MAIN PAGE!!!

// import { WIN, DOC, G, BODY, CLASSES, BREAKPOINTS } from './../_globals';

// export default class Header {
//   constructor(el) {
//     this.header = $(el);
//     this.logo = this.header.find('.js-logo img');
//     this.logoLight = this.logo.data('src-light');
//     this.logoDark = this.logo.data('src-dark');
//     this.burger = this.header.find('.js-burger');
//     this.navItem = this.header.find('.nav__link, .lang__toggle');

//     this.lastScroll = 0;
//     this.scrollBack = false;

//     this.isAccordionEnabled = false;

//     this.fixDistance = G.isHome && !BREAKPOINTS.mobile.matches ? WIN.height() : 0;
//   }

//   init() {
//     DOC.on('scroll', this._onScroll.bind(this));
//     this.burger.on('click', this._onClick.bind(this));
//     this.navItem.on('click', this._onItemClick.bind(this));

//     DOC.on('mousemove', this._onMouseMove.bind(this));

//     this._testTabletScreen(BREAKPOINTS.tablet);
//     BREAKPOINTS.tablet.addListener(this._testTabletScreen.bind(this));

//     if (G.isHome) {
//       this._testMobileHomeScreen(BREAKPOINTS.mobile);
//       BREAKPOINTS.mobile.addListener(this._testMobileHomeScreen.bind(this));
//     }
//   }

//   _onScroll(e) {
//     if (BODY.hasClass(CLASSES.modalOpen)) return;

//     if (!BREAKPOINTS.mobile.matches) {
//       var st = window.pageYOffset || document.documentElement.scrollTop;
//       this.scrollBack = st < this.lastScroll;
//       this.lastScroll = st <= 0 ? 0 : st;

//       if (G.isHome || G.isArticle) {
//         WIN.scrollTop() - this.header.height() > this.fixDistance ? this.fixHome() : this.unfixHome();
//         if (this.scrollBack && !this.header.hasClass(CLASSES.active)) {
//           this.header.addClass(CLASSES.visible);
//         } else {
//           this.header.removeClass(CLASSES.visible);
//           this._deactivate();
//         }
//       } else {
//         WIN.scrollTop() - this.header.height() > this.fixDistance ? this.fix() : this.unfix();
//         if (this.scrollBack && !this.header.hasClass(CLASSES.active)) {
//           this.header.addClass(CLASSES.visible);
//         } else {
//           this.header.removeClass(CLASSES.visible);
//           this._deactivate();
//         }
//       }
//     }
//     else {
//       if (G.isArticle) {
//         WIN.scrollTop() > this.fixDistance ? this.fixArticleMob() : this.unfixArticleMob();
//       } else {
//         WIN.scrollTop() > this.fixDistance ? this.fix() : this.unfix();
//       }
//     }
//   }

//   fix() {
//     if (!this.header.hasClass(CLASSES.fixed)) this.header.addClass(CLASSES.fixed);
//   }

//   unfix() {
//     if (this.header.hasClass(CLASSES.fixed)) this.header.removeClass(CLASSES.fixed);
//   }

//   fixHome() {
//     if (!this.header.hasClass(CLASSES.fixed)) {
//       this.header.addClass(CLASSES.fixed);
//       this.header.addClass('header_dark');

//       if (BREAKPOINTS.mobile.matches) return;
//       this.logo.attr('src', this.logoLight);
//     }
//   }

//   unfixHome() {
//     if (this.header.hasClass(CLASSES.fixed)) {
//       this.header.removeClass(CLASSES.fixed);
//       this.header.removeClass('header_dark');

//       if (BREAKPOINTS.mobile.matches) return;
//       this.logo.attr('src', this.logoDark);
//     }
//   }

//   fixArticleMob() {
//     if (!this.header.hasClass(CLASSES.fixed)) {
//       this.header.addClass(CLASSES.fixed);
//       this.header.addClass('header_dark');
//       this.logo.attr('src', this.logoLight);
//     }
//   }

//   unfixArticleMob() {
//     if (this.header.hasClass(CLASSES.fixed)) {
//       this.header.removeClass(CLASSES.fixed);
//       this.header.removeClass('header_dark');
//       this.logo.attr('src', this.logoDark);
//     }
//   }

//   _onMouseMove(e) {
//     if (BODY.hasClass(CLASSES.modalOpen)) return;
//     if (e.clientY <= this.header.height()) {
//       if (!this.header.hasClass(CLASSES.visible) && !BREAKPOINTS.mobile.matches) {
//         this.header.addClass(CLASSES.visible);
//       } else {
//         if (this.header.hasClass(CLASSES.active)) return;

//         this.header.removeClass(CLASSES.visible);
//         this._deactivate();
//       }
//     }
//   }

//   _onClick(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     $(e.currentTarget).toggleClass(CLASSES.active);
//     $(e.currentTarget).closest(this.header).toggleClass(CLASSES.active);
//     BODY.toggleClass(CLASSES.modalOpen);
//     if (this.isAccordionEnabled && !BODY.hasClass(CLASSES.modalOpen)) {
//       $('.subnav, .lang__list').slideUp(300);
//       this.navItem.removeClass('is-open');
//     }

//     if (G.isHome || G.isArticle) {
//       this.header.hasClass(CLASSES.active) ? this.fixHome() : this.unfixHome();
//     }
//   }

//   _onItemClick(e) {
//     e.preventDefault();

//     if ($(e.currentTarget).hasClass('is-open')) return;
//     this.navItem.removeClass('is-open');
//     $(e.currentTarget).addClass('is-open');
//     $('.subnav, .lang__list').slideUp(300);
//     $(e.currentTarget).next('.subnav, .lang__list').slideDown(300);

//     if ($(e.currentTarget).hasClass('lang__toggle')) return;
//     this._deactivate();
//   }

//   _enableAccordion() {
//     $('.subnav, .lang__list').slideUp(300);
//     this.isAccordionEnabled = true;
//   }

//   _disableAccordion() {
//     $('.subnav, .lang__list').removeAttr('style');
//     this.isAccordionEnabled = false;
//   }

//   _deactivate() {
//     this.burger.removeClass(CLASSES.active);
//     this.header.removeClass(CLASSES.active);
//     BODY.removeClass(CLASSES.modalOpen);
//   }

//   _testMobileHomeScreen(point) {
//     if (point.matches) {
//       this.logo.attr('src', this.logoLight);
//     }
//     else {
//       this.logo.attr('src', this.logoDark);
//     }
//   }

//   _testTabletScreen(point) {
//     if (point.matches) {
//       this._enableAccordion();
//     }
//     else {
//       this._disableAccordion();
//     }
//   }
// }
