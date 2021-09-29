import { DOC, WIN, G, BREAKPOINTS } from './../_globals';
import Mountains from './Mountains';

import { TimelineLite } from 'gsap/TweenMax';

const initMountains = () => {
  G.tl = new TimelineLite({
    paused: true,
    onStart: () => {
      G.isAnimating = true;
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo('.js-start-reveal', 0.5, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.5);
      }, 600);

      setTimeout(() => {
        $('.hero, .scroller').addClass('is-ready');
      }, 2800);
    },
    onComplete: () => {
      G.isAnimating = false;
    }
  });

  $('.js-mountains').each((index, el) => {
    const group = new Mountains(el);
    group.init();

    G.mountainGroups.push(group);
  });
};


DOC.ready(() => {
  $('.hero').css('height', WIN.height());
  WIN.on('resize', e => {
    if (BREAKPOINTS.mobile.matches) return;
    $('.hero').css('height', WIN.height());
  });
  initMountains();
  G.tl.play();
});
