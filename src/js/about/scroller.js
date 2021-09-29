import PubSub from 'pubsub-js';
import TweenMax from 'gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js';

export default class Scroller {
  constructor(el, browser) {
    this.el = $(el);

    this.windowHeight = $(window).innerHeight();
    this.windowWidth = $(window).outerWidth();
    this.currentS = 0;
    this.prevS = 0;
    this.isScrolling = false;
    this.screens = $('.js-screen');
    this.maxScroll = this.screens.length*this.windowHeight + this.windowHeight;
    this.titles = [];
    this.contentAnimTweens = [];
    this.progressStep = this.maxScroll/this.screens.length;
    this.progress = 1 / this.screens.length;
    this.canScroll = true;
    this.tlClickBoost = 1;
    this.currentScreen = 0;
    this.browser = browser;
    this.nav = $('.js-date-nav');
    this.activeClass = 'is-active';

    this._init();
  }
  _init() {

    if(!this.el[0]) return;
    $('body').addClass(`scroller-prepared ${this.browser.name}`);

    this._prepareTitles();
    this._createTitlesTl();
    this._prepareContentAnim();
    this._scroll();

    this._loadAnim();
    this._initNav();
  }

  _createTitlesTl() {
    this.tlTitles = new TimelineMax({paused: true});
    let self = this;

    for (let i = 0; i < this.titles.length; i++) {
      this.tlTitles
        .set(this.titles[i], {className: '+=is-visible'})
        .to(this.titles[i], 0.5, {
          z: 0,
          x: this.titles[i].myData.left -this.windowWidth/3 ,
          y: this.titles[i].myData.top,
          opacity: 1,
          filter: 'blur(0px)',
          ease: Linear.easeNone
        });
      if(i < this.screens.length - 1) {
        this.tlTitles.set(this.titles[i +1], {className: '+=is-visible'});
      }
      if(i > 0) {
        let x = this.windowWidth/2 - this.titles[i-1].myData.left - this.titles[i-1].myData.w + this.windowWidth/12;
        let y = this.windowHeight/2 + this.titles[i-1].myData.top/2 - this.windowHeight/10;
        this.tlTitles
          .set(this.titles[i-1], {className: '+=reset-filter'})
          .set(this.titles[i-1], {className: '+=is-visible'})
          .to(this.titles[i-1], 0.5, {
            z: 1000,
            x: x,
            y:  y,
            ease: Linear.easeNone,
            onComplete: callback,
            onReverseComplete: callback,
          }, '-=0.5');
      }
      this.tlTitles.addLabel(`${i}`);
    }
    this.tlTitlesTotalDuration = this.tlTitles.totalDuration();

    function callback() {
      if( self.tlClickBoost > 1) {
        self.tlTitles.totalDuration(self.tlTitlesTotalDuration);
        self.tlClickBoost = 1;
      }
      if(self.currentScreen === +self.tlTitles.currentLabel()) {
        setTimeout(() => {self._animateInContent();}, 250);
      }

    }
  }

  _changeTitles() {
    if( this.tlClickBoost > 1) {
      this.tlTitles.totalDuration(12/this.tlClickBoost).tweenTo(`${this.currentScreen}`);
    }else{
      this.tlTitles.tweenTo(`${this.currentScreen}`);
    }
    this._callWawes();
  }

  _prepareTitles() {
    let $titles = $('.js-screen-title');
    let self = this;
    let titlesPlace;

    if(this.browser.name === 'safari') {
      let $titlesWrapper = $('<div>');
      $titlesWrapper.addClass('sections-wrapper__titles-wrap js-titles-wrap');
      this.el.find('#container').append($titlesWrapper);
      titlesPlace = this.el.find('.js-titles-wrap');
    }else{
      titlesPlace = this.el.parent();
    };

    $titles.each(function(i,el) {
      let $title = $(el);
      let h = $title.innerHeight();
      let w = $title.outerWidth();
      let left = $title.position().left ;
      let top = $title.position().top;
      let cloneTitle =  $title.clone(true);
      let z =  -1000;
      cloneTitle.addClass('prepared');
      cloneTitle.attr('style', `width: ${w}px; height: ${h}px; transform:translate3d(0px, 0px, ${z}px);`);

      cloneTitle.myData = {h, w, left, top, z };
      titlesPlace.append(cloneTitle);
      self.titles.push(cloneTitle);

    });


  }

  _loadAnim() {
    this.canScroll = false;

    setTimeout(() => {
      TweenMax.set(this.titles[0], {className: '+=is-visible'});
      TweenMax.to(this.titles[0], 0.5, {
        z: 0,
        x: this.titles[0].myData.left -this.windowWidth/3 ,
        y: this.titles[0].myData.top,
        opacity: 1,
        filter: 'blur(0px)',
        ease: Linear.easeNone,
        onComplete: () => {
          if(this.titles[1]) {
            TweenMax.set(this.titles[1], {className: '+=is-visible'});
          }
          this._animateInContent();}
      }, '+=0');
      // this._callWawes();
    }, 500);
  }

  _prepareContentAnim() {
    let self = this;
    this.screens.each(function(i, el) {
      let $section = $(el);
      let $content = $section.find('[data-stagger="stagger"]');
      let tl = new TimelineMax({paused: true});

      tl
        .staggerFromTo($content, 0.2, {opacity:0, y:-50}, {opacity:1, y:0}, 0.1);
      self.contentAnimTweens.push(tl);
    });

  }

  _animateInContent() {
    this.contentAnimTweens[this.currentScreen].play();
    $(this.screens[this.currentScreen]).addClass(this.activeClass);

    setTimeout(() => {
      this.canScroll = true;
    }, 1300);
  }
  _animateOutContent() {
    this.canScroll = false;
    this.screens.removeClass(this.activeClass);
    this.contentAnimTweens[this.currentScreen].reverse();

    setTimeout(() => {
      this._changeTitles();
    }, 250);

  }

  _scroll() {
    document.addEventListener('wheel', (event) => {
      event.preventDefault();
      if(this.canScroll === false) return;
      this.canScroll = false;
      this.direction = event.deltaY > 0 ? 1 :-1;

      let newSlideIndex = this.currentScreen + this.direction;

      if(newSlideIndex>this.screens.length - 1 || newSlideIndex<0) {
        this.canScroll = true;
        return;
      };

      this._animateOutContent();
      this.currentScreen = newSlideIndex;
      this._checkNavState();
      // this._callWawes();
    });
  }

  _checkNavState() {
    if($(this.screens[this.currentScreen]).is('[data-screen]')) {
      this.nav.addClass('is-visible');
      this.nav.find('.js-date-nav-link').removeClass('is-active');
      this.nav.find(`.js-date-nav-link[data-target=${$(this.screens[this.currentScreen]).attr('data-screen')}]`).addClass('is-active');
    }else{
      this.nav.removeClass('is-visible');
    }
  }

  _callWawes() {
    this.progress = (this.currentScreen + 1) / this.screens.length ;
    let data = {
      slidesCount: this.screens.length,
      progress: this.progress,
      currentSlide: this.currentScreen
    };

    PubSub.publish('scrollerEvent', data);
  }

  _initNav() {
    if(!this.nav[0]) return;
    let self = this;
    let $links = this.nav.find('.js-date-nav-link');

    $links.on('click', function(e) {
      e.preventDefault();
      if( this.canScroll === false) return;

      let $this = $(this);
      let tagetIndex = $this.attr('data-target');
      let $target = $(`.js-screen[data-screen="${tagetIndex}"]`);
      let index = self.screens.index($target);
      if(index === self.currentScreen ) return;
      $links.removeClass('is-active');
      $this.addClass('is-active');
      self._animateOutContent(false);
      let distanceToScreen = Math.abs(self.currentScreen - index);
      self.tlClickBoost = distanceToScreen > 1 ? distanceToScreen : 1;
      self.currentScreen = index;
    });
  }
}
