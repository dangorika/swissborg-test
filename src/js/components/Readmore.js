import readmore from 'readmore-js';
import imagesLoaded from 'imagesloaded';
import PubSub from 'pubsub-js';
import { BREAKPOINTS } from './../_globals';

export default class Readmore {
  constructor(block) {
    this.block = $(block);
    this.rowVisible = this.block.data('row-visible');
    this.tabletRowVisible = this.block.data('tablet-row-visible');
    this.tabletMode = this.block.data('tablet-mode');
    this.moreText = this.block.data('more-btn');
    this.lessText = this.block.data('less-btn');
    this.isBtnLink = this.block.data('btn-link');
  }

  init() {
    imagesLoaded(this.block, () => {
      if (this.tabletMode) {
        this._testScreen(BREAKPOINTS.tablet);
        BREAKPOINTS.tablet.addListener(this._testScreen.bind(this));
      }
      else {
        this._testTabletScreen(BREAKPOINTS.tablet);
        BREAKPOINTS.tablet.addListener(this._testTabletScreen.bind(this));
      }
    });

    PubSub.subscribe('blogUpdate', () => {
      this._testTabletScreen(BREAKPOINTS.tablet);
      BREAKPOINTS.tablet.addListener(this._testTabletScreen.bind(this));
    });
  }

  _getHeight() {
    let height = 0;
    this.block.children().each((index, el) => {
      if (index < this.rowVisible) {
        height += $(el).outerHeight(true);
      }
    });
    console.log(height);

    return height;
  }

  _getOptions() {
    return {
      speed: 500,
      collapsedHeight: this._getHeight(),
      moreLink: `<button class="button button_primary">${this.moreText}</button>`,
      lessLink: `<button class="button button_primary">${this.lessText}</button>`
    };
  }

  _getBtnLinkOptions() {
    return {
      speed: 500,
      collapsedHeight: this._getHeight(),
      moreLink: `<a href="" class="link">${this.moreText}</a>`,
      lessLink: `<a href="" class="link">${this.lessText}</a>`
    };
  }

  _testScreen(point) {
    if (point.matches) {
      this.block.readmore(this._getOptions());
    }
    else {
      this.block.readmore('destroy');
    }
  }

  _testTabletScreen(point) {
    if (point.matches) {
      this.block.readmore('destroy');
      if (this.isBtnLink) {
        this.block.readmore(this._getBtnLinkOptions());
      } else {
        this.block.readmore(this._getOptions());
      }
    }
    else {
      this.block.readmore('destroy');
      if (this.isBtnLink) {
        this.block.readmore(this._getBtnLinkOptions());
      } else {
        this.block.readmore(this._getOptions());
      }
    }
  }
}
