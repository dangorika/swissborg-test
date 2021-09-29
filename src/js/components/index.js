import { DOC, G } from './../_globals';

import Roadmap from './Roadmap';
import Logos from './Logos';
import Tab from './Tab';
import Header from './Header';
import Numbers from './Numbers';
import ScrollTo from './ScrollTo';
import Benefits from './Benefits';
import Select from './Select';
import Readmore from './Readmore';
import Modal from './Modal';
import Map from './Map';
import CareerFilter from './CareerFilter';
import BlogFilter from './BlogFilter';
import ClickCounter from './ClickCounter';

import Team from './Team';

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

const initBenefits = () => {
  $('.js-benefits').each((index, el) => {
    new Benefits(el).init();
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

const initSelect = () => {
  $('.js-select').each((index, el) => {
    new Select(el).init();
  });
};

const initReadmore = () => {
  $('.js-readmore').each((index, el) => {
    new Readmore(el).init();
  });
};

const initModal = () => {
  $('[data-modal]').each((index, el) => {
    new Modal(el).init();
  });
};

const initMap = () => {
  $('.js-map').each((index, el) => {
    new Map(el).init();
  });
};

const initCareerFilter = () => {
  if ($('.js-tag-select').length === 0 && $('.js-location-select').length === 0) return;
  new CareerFilter({
    tagSelect: '.js-tag-select',
    locationSelect: '.js-location-select'
  }).init();
};

const initBlogFilter = () => {
  if ($('.js-blog-select').length === 0) return;
  new BlogFilter('.js-blog-select').init();
};

const initClickCounter = () => {
  $('.js-click-counter').each((index, el) => {
    new ClickCounter(el).init();
  });
};

DOC.ready(() => {
  initRoadmap();
  initLogos();
  initTabs();
  initHeader();
  initNumbers();
  initBenefits();
  initTeam();
  initScrollTo();
  initSelect();
  initReadmore();
  initModal();
  initMap();
  initCareerFilter();
  initBlogFilter();
  initClickCounter();
});
