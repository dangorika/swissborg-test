import '@babel/polyfill';
import objectFitImages from 'object-fit-images';
import svg4everybody from 'svg4everybody';


import {BODY, DOC, G} from './_globals';
import './mountains';
import './waves';
import './_RAF';

import Roadmap from './components/Roadmap';
import Logos from './components/Logos';
import Tab from './components/Tab';
import Header from './components/Header';
import Numbers from './components/Numbers';
import ScrollTo from './components/ScrollTo';
import Map from './components/Map';
import Team from './components/Team';


const initRoadmap = () => {
  $('.js-roadmap').each((index, el) => {
    new Roadmap(el).init();
  });
};

const initLogos = () => {
  $('.js-logos').each((index, el) => {
    new Logos(el).init();
  });
};

const initTabs = () => {
  $('.js-tab').each((index, el) => {
    new Tab(el).init();
  });
};

const initHeader = () => {
  G.HEADER = new Header('.js-header');
  G.HEADER.init();
};

const initNumbers = () => {
  $('.js-numbers').each((index, el) => {
    new Numbers(el).init();
  });
};

const initTeam = () => {
  $('.js-team').each((index, el) => {
    new Team(el).init();
  });
};

const initScrollTo = () => {
  new ScrollTo().init();
};

const initMap = () => {
  $('.js-map').each((index, el) => {
    new Map(el).init();
  });
};


const { detect } = require('detect-browser');
const browser = detect();

console.log(browser.name);

if (browser.os === 'Mac OS') {
  BODY.addClass('is-macos');
}

if (browser.name === 'ie') {
  BODY.addClass('is-ie');
}


DOC.ready(() => {
  svg4everybody();
  objectFitImages();
  initRoadmap();
  initLogos();
  initTabs();
  initHeader();
  initNumbers();
  initTeam();
  initScrollTo();
  initMap();
});
