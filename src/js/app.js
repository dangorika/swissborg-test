import sayHello from './lib/sayHello.js';

sayHello();


import '@babel/polyfill';
import objectFitImages from 'object-fit-images';
import svg4everybody from 'svg4everybody';


import {BODY, DOC} from './_globals';
import './components';
import './charts';
import './mountains';
import './waves';

import './_RAF';


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
});
