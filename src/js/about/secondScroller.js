import PubSub from 'pubsub-js';
import ScrollMagic from 'scrollmagic';
import TweenMax from 'gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js';
import NormalizeWheel from './normwheel';
import throttleFunc from './../lib/throttle';
import debounce from './../lib/debounce';
import TweenLite from 'gsap/TweenLite';
// import Lethargy from 'lethargy/lethargy.js';

// import  './../lib/lethargy.min.js';

export default class Scroller {
  constructor(el) {
    this.el = $(el);

    this.windowHeight = $(window).innerHeight();
    this.windowWidth = $(window).outerWidth();
    this.currentS = 0;
    this.prevS = 0;
    this.isScrolling = false;
    this.screens = $('.js-screen');
    this.speed = 0;
    this.lastS = 0;
    this.lastTime = 0;
    // this.maxScroll = (this.el.innerHeight() - this.windowHeight);
    this.maxScroll = this.screens.length*this.windowHeight;
    this.scenes = [];
    this.titles = [];
    this.contentAnimTweens = [];
    this.progressStep = this.maxScroll/this.screens.length;
    this.Lethargy = require('./../lib/lethargy.min.js').Lethargy;
    this.canScroll = true;
    self.currentScreen = 0;
    this.nav = $('.js-date-nav');
    this.activeClass = 'is-active';
    // this.hideContentArr = [];
    // this.prevMaxSpin = 0;




    this._init();
  }
  _init() {
    if(!this.el[0]) return;
    let self = this;

    // $('body').addClass('scroller-body').css('height',`${this.maxScroll}px`);
    $('body').css('height',`${this.maxScroll}px`);
    // this._velocity();
    this._prepareTitles();
    this._prepareContentAnim();

    console.log(this.windowWidth);


    this.controller = new ScrollMagic.Controller({
    });

    let tl = this._generateHeadersTimeLine();

    this.scene = new ScrollMagic.Scene({
      // triggerElement: this.el[0],
      triggerHook: 0,
      duration: this.screens.length*this.windowHeight
    })
      .addTo(this.controller)
      .setTween(tl);
    this.scene.on('progress', function(event) {
      self.progress = event.progress;
    });

    this._scroll();
    this._loadAnim();
    this._initNav();





    // this._prepareScenes();
  }
  _loadAnim() {
    this.canScroll = false;
    this.scroll = $(document).scrollTop();


    this.currentScreen = Math.round(this.scroll/this.windowHeight);
    console.log(this.currentScreen);
    if(this.currentScreen === 0) {

      TweenMax.set(this.titles[0], {className: '+=is-visible'});


      TweenMax.to(this.titles[0], 0.4, {
        z: 0,
        x: this.titles[0].myData.left -this.windowWidth/3 ,
        y: this.titles[0].myData.top,
        opacity: 1,
        filter: 'blur(0px)',
        ease: Linear.easeNone
      }, '+=0');

      this._animateInContent();


    }else{
      setTimeout(() => {
        $('html, body').animate({scrollTop: this.currentScreen* this.windowHeight},{easing: 'linear'}, 400);
        this._animateInContent();

      }, 100);
    }

  }

  _generateHeadersTimeLine() {
    let tl = new TimelineMax();

    for (let i = 1; i < this.titles.length; i++) {
      // if(i === 0) {
      //   tl
      //     .set(this.titles[i], {className: '+=is-visible'});
      // }

      if(i > 0) {
        tl
          .set(this.titles[i], {className: '+=is-visible'});

      }

      // приближение к нормальной позиции активного заголовка

      if(i > 0) tl.set(this.titles[i-1], {className: '+=reset-filter'});

      tl
        // .set(this.titles[i], {z: this.titles[i].myData.z, x: this.windowWidth /2, y: 200})
        .add(`step-${i}`)
        .to(this.titles[i], 1, {
          z: 0,
          x: this.titles[i].myData.left -this.windowWidth/3 ,
          y: this.titles[i].myData.top,
          opacity: 1,
          filter: 'blur(0px)',
          ease: Linear.easeNone
        }, '+=0');

      if(i > 0) {


        // let tamp =(1* (this.titles[i-1].myData.w/2 - this.titles[i-1].myData.w*0.1));

        // let tamp = 0.5 * 1 / this.windowWidth;
        // let x = this.windowWidth/2 - this.titles[i-1].myData.w/2 - this.titles[i-1].myData.left - tamp;
        let x = this.windowWidth/2 - this.titles[i-1].myData.left - this.titles[i-1].myData.w + this.windowWidth/12;
        let y = this.windowHeight/2 + this.titles[i-1].myData.top/2 - this.windowHeight/10;
        tl
          .set(this.titles[i-1], {className: '+=is-visible'})
          .to(this.titles[i-1], 1, {
            z: 1000,
            // x: this.windowWidth/2 - this.titles[i-1].myData.left + (10* (this.titles[i-1].myData.w/2)*0.15) - this.titles[i-1].myData.w/2,
            x: x,
            // x: -10,
            // y: this.titles[i-1].myData.top + this.windowHeight/2,
            y:  y,
            // opacity: 0.8,
            ease: Linear.easeNone
            // onComplete: () => {console.log(tamp);}
          }, '-=1');
      }


    }

    return tl;
  }
  _prepareTitles() {
    let $titles = $('.js-screen-title');
    let self = this;
    // let step = 1000/ $titles.length;
    // let step = 1000;

    $titles.each(function(i,el) {
      let $title = $(el);
      let h = $title.innerHeight();
      let w = $title.outerWidth();
      let left = $title.position().left ;
      let top = $title.position().top;
      // let z =  -step*(i+1);
      let z =  -1000;




      let cloneTitle =  $title.clone(true);
      cloneTitle.addClass('prepared');
      cloneTitle.attr('style', `width: ${w}px; height: ${h}px; transform:translate3d(0px, 0px, ${z}px);`);
      // cloneTitle[0].css({'transform': `translate3d(0px, 0px, ${z}px);`});
      // cloneTitle[0].style.transform = `translate3d(0px, 0px, ${z}px);`;
      // cloneTitle.css('height', `);
      cloneTitle.myData = {h, w, left, top, z };
      // console.log( cloneTitle.myData);

      self.el.parent().append(cloneTitle);
      self.titles.push(cloneTitle);

    });


  }

  _prepareContentAnim(index) {
    let self = this;
    this.screens.each(function(i, el) {
      let $section = $(el);
      let $content = $section.find('[data-stagger="stagger"]');

      //out
      // let tlOut = new TimelineMax({paused: true, onComplete: () => {
      //   console.log('dis anim');
      //   self.canScroll = true;
      // }});
      // tlOut
      //   .staggerFromTo($content, 0.3, {opacity:1, y:0}, {opacity:0, y:-50}, 0.1);
      // self.content_Anim_Out_Arr.push(tlOut);


      // in
      let tl = new TimelineMax({paused: true, onComplete: () => {
        // console.log('anim');

        this.canScroll = true;
      }});
      tl
        .staggerFromTo($content, 0.2, {opacity:0, y:-50}, {opacity:1, y:0}, 0.1);
      self.contentAnimTweens.push(tl);


    });

  }

  _animateInContent() {
    // let self = this;

    setTimeout(() => {
      // if(this.currentScreen < 0) {
      //   console.log('anim none');
      //   this.canScroll = true;
      //   return;
      // }
      let index = this.currentScreen === 0 ? 0 : this.currentScreen -1;
      this.contentAnimTweens[index].play();
      $(this.screens[index]).addClass(this.activeClass);
      this.canScroll = true;
      // this.currentScreen.addClass(this.activeClass);
    }, 400);

  }
  _animateOutContent() {

    // let i = index === undefined ? self.currentScreen - 1: index;
    // setTimeout(function() {
    let index = this.currentScreen === 0 ? 0 : this.currentScreen -1;
    this.screens.removeClass(this.activeClass);
    this.contentAnimTweens[index].reverse();

    // this.canScroll = true;
    // tl.reverse()

    // }, 1000);

  }







  _scroll() {
    let self = this;

    var body = $('html, body');
    // let lethargy = new this.Lethargy();


    // let myDebounceFunction = debounce(scrollFunc1, 100);

    // let throttle = throttleFunc(scrollFunc1, 35);
    document.addEventListener('wheel', function(event) {
      if(self.canScroll === false) {
        event.preventDefault();
        return;
      }

      self.event = event;
      let norm =  NormalizeWheel(self.event);

      let timeOut = 0;
      // console.log(self.progress);
      // PubSub.publish('scrollWawes', {progress: self.progress});

      if(Number.isInteger(norm.spinY)) {
        timeOut = 150;
      }else {
        timeOut = 50;
      }
      if(self.currentScreen > 0 ) {
        self._animateOutContent();

      }

      clearTimeout($.data(this, 'scrollTimer'));
      $.data(this, 'scrollTimer', setTimeout(function() {
        self.canScroll = false;
        scrollFunc1();
      }, timeOut));




    });




    function scrollFunc1() {

      self.scroll = $(document).scrollTop();

      let norm =  NormalizeWheel(self.event);
      let currentScreen = 0;
      if(norm.spinY> 0) {
        currentScreen = Math.ceil(self.scroll/self.windowHeight);
        self.currentS = currentScreen*self.windowHeight;


      }else if(norm.spinY < 0) {
        currentScreen = Math.floor(self.scroll/self.windowHeight);
        self.currentS = currentScreen*self.windowHeight;

      }
      if(self.currentS<0) self.currentS = 0;
      if(self.currentS >= self.maxScroll) self.currentS = self.maxScroll;
      self.currentScreen = currentScreen;
      console.log(self.currentScreen);


      body.animate({scrollTop: self.currentS},{easing: 'linear'}, 400);
      self._checkNavState();
      // console.log(self.currentScreen);
      self._animateInContent();
    }



  }


  _checkNavState() {
    if($(this.screens[this.currentScreen - 1]).is('[data-screen]')) {
      this.nav.addClass('is-visible');
    }else{
      this.nav.removeClass('is-visible');
    }
  }
  _initNav() {
    if(!this.nav[0]) return;
    let self = this;
    let $links = this.nav.find('.js-date-nav-link');

    $links.on('click', function(e) {
      e.preventDefault();
      if(self.currentScreen > 0 ) {
        self._animateOutContent();
      }
      let $this = $(this);
      let tagetIndex = $this.attr('data-target');
      let $target = $(`.js-screen[data-screen="${tagetIndex}"]`);
      let index = self.screens.index($target) + 1;
      let scroll = Math.round(index*self.windowHeight);

      // let scroll = $target.offset.top()

      self.currentS = scroll;

      if(self.currentS<0) self.currentS = 0;
      if(self.currentS >= self.maxScroll) self.currentS = self.maxScroll;

      $('html, body').animate({scrollTop: self.currentS},{easing: 'linear'}, 1000);
      self.currentScreen = index;
      // console.log($target, index, self.currentS, self.currentScreen);

      self._animateInContent();

    });

  }
  _prepareScenes() {
    let self = this;
    this.screens.each(function(index, el) {
      let $screen = $(el);

      let tween = self._prepareTitle($screen, self);

      let scene = new ScrollMagic.Scene({
        triggerElement: el,
        // reverse: true,
        // duration: 200,
        // offset: 300
      })
        .setTween(tween)
        // .addIndicators({name: 'resize'})
        .addTo(self.controller);




      scene.myIndex = index;
      self.scenes.push(scene);

      $screen.myIndex = index;
      self.screens.push($screen);


      // function callback(event) {
      //   if(event.type === 'enter') {

      //     let prevSceneIndex = event.target.myIndex - 1;
      //     if (prevSceneIndex === -1) return;
      //     self._animateTitle_1(prevSceneIndex);
      //     self._hideContent(prevSceneIndex);
      //     self._showContent(prevSceneIndex+1);


      //   }else if(event.type === 'leave') {
      //     let prevSceneIndex = event.target.myIndex - 1;
      //     self._showContent(prevSceneIndex);
      //     self._animateTitle_2(prevSceneIndex);

      //   }

      // }

      // scene.on(' enter leave', callback);
    });

  }






  _velocity() {
    let self = this;
    function wrapVel(e) {
      if (self.isScrolling) {
        self.speed = (self.currentS - self.lastS) / (e - self.lastTime);

        if(self.speed<-3) self.speed = -3;
        if(self.speed>3) self.speed = 3;

        self.lastTime = e;
        self.lastS = self.currentS;
      }
      window.requestAnimationFrame(wrapVel);
    }
    wrapVel();

  }

}
