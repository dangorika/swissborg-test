import {TimelineMax} from 'gsap';

let participateElem = $('.js-participate-anim');
participateElem.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({repeat: -1, yoyo: true});
  tl
    .to($el, 2, {scale: 0.93, transformOrigin: '50% 50%', ease: Power0.easeNone}, 0);
});


let getElem = $('.js-get-anim');
getElem.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({repeat: -1, yoyo: true, delay: 1});
  tl
    .to($el, 2, {x: -18, ease: Power0.easeNone}, 0);
});

let additional = $('.js-additional-anim_1,  .js-icoAbout-anim');
additional.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({repeat: -1, delay: 0.5});
  tl
    .to($el, 8, {rotation: 360, ease: Power0.easeNone, transformOrigin: '50% 50%'}, 0);
});

let totalSupply = $('.js-totalSupply_up');
totalSupply.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({ delay: 2, repeat: -1, repeatDelay: 1});
  let upPaths = $el.find('path');
  let upPathsReverse = upPaths.get().reverse();
  let downPaths = $('.js-totalSupply_down').find('path');
  let downPathsReverse = downPaths.get().reverse();

  tl
    .staggerTo($el.find('path'), 0.4, {y: -5, ease: Power0.easeNone}, 0.25, 0)
    .staggerTo(downPathsReverse, 0.4, {y: 5, ease: Power0.easeNone}, 0.25, '+=0.2')
    .staggerTo(upPathsReverse, 0.4, {y: 0, ease: Power0.easeNone}, 0.25, '+=0.2')
    .staggerTo(downPaths, 0.4, {y: 0, ease: Power0.easeNone}, 0.25, '+=0.2');
});


let community = $('.js-community-anim');
community.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({ delay: 1.5, repeat: -1});
  let upPaths = $el.find('path');


  tl
    .staggerTo($el.find('path'), 0.5, {scale: 0.6, transformOrigin: '50% 50%', ease: Power0.easeNone}, 0.3, 0)
    .staggerTo($el.find('path'), 0.5, {scale: 1, transformOrigin: '50% 50%', ease: Power0.easeNone}, 0.3, '+=0');

});

let tokenAbout = $('.js-tokenAbout-anim');
tokenAbout.each(function(i, el) {
  let $el = $(el);
  let tl = new TimelineMax({ delay: 0, repeat: -1});

  tl
    .to($el, 1, {rotation: 10, transformOrigin: '50% 50%', ease: Power0.easeNone}, 0)
    .to($el, 2, {rotation: -10, transformOrigin: '50% 50%', ease: Power0.easeNone}, '+=0')
    .to($el, 1, {rotation: 0, transformOrigin: '50% 50%', ease: Power0.easeNone}, '+=0');

});


