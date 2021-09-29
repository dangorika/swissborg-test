import { DOC, G } from './../_globals';
import DATA from './_data.js';
import Wave from './Wave';

import inView from 'in-view';

let WAVES = [];

const initWaves = () => {
  DATA.forEach((el, index) => {
    const elements = $('.js-wavepath');
    const wave = new Wave(elements[index], el);
    wave.init();
    WAVES.push(wave);
  });
};

DOC.ready(() => {
  if ($('.js-wavepath').length !== 0) initWaves();

  let index = 0;

  inView.threshold(0.33);

  inView('.js-waves-app').once('enter', el => {
    let index = $('.js-waves').index(el);

    WAVES[index].play(() => {
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo($(el).parent().find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
      }, 300);
    });
  });

  inView('.js-waves-limit').once('enter', el => {
    let index = $('.js-waves').index(el);

    WAVES[index].play(() => {
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo($(el).parent().find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
      }, 300);
    });
  });

  inView('.js-waves-cases').once('enter', el => {
    let index = $('.js-waves').index(el);

    WAVES[index].play(() => {
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo($(el).parent().find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
      }, 300);
    });
  });

  inView('.js-waves-token').once('enter', el => {
    let index = $('.js-waves').index(el);

    WAVES[index].play(() => {
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo($(el).parent().find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3)
          .fromTo($(el).parent().find('.js-reveal-end'), 0.4, {opacity: 0}, {opacity: 1}, '-=.3');
      }, 300);
    });
  });

  inView('.js-waves-logos').once('enter', el => {
    let index = $('.js-waves').index(el);

    WAVES[index].play(() => {
      setTimeout(() => {
        let tl = new TimelineLite();
        tl.staggerFromTo($(el).parent().find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
      }, 300);
    });
  });

  inView('.js-section-solutions').once('enter', el => {
    let tl = new TimelineLite();
    tl.staggerFromTo($(el).find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
  });

  inView('.js-section-numbers').once('enter', el => {
    let tl = new TimelineLite();
    tl.staggerFromTo($(el).find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
  });

  inView('.js-section-token').once('enter', el => {
    let tl = new TimelineLite();
    tl.staggerFromTo($(el).find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
  });

  inView('.js-section-logos').once('enter', el => {
    let tl = new TimelineLite();
    tl.staggerFromTo($(el).find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
  });

  inView('.js-section-resources').once('enter', el => {
    let tl = new TimelineLite();
    tl.staggerFromTo($(el).find('.js-reveal'), 0.4, {opacity: 0, y: 30}, {opacity: 1, y: 0}, 0.3);
  });
});
