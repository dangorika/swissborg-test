import { BREAKPOINTS } from './../_globals';

export default class Tab {
  constructor(tab) {
    this.tab = $(tab);
  }

  init() {
    this._testScreen(BREAKPOINTS.tablet);
    BREAKPOINTS.tablet.addListener(this._testScreen.bind(this));
    this.tab.on('click', this._show.bind(this));
  }

  _show(e) {
    e.preventDefault();
    const target = $(e.currentTarget);

    if (BREAKPOINTS.tablet.matches) {
      if (target.hasClass('is-active')) return;

      $('[data-tab]').removeClass('is-active');
      target.addClass('is-active');

      $('[data-tab]').find('.js-mob-description').slideUp(400);
      target.find('.js-mob-description').slideDown(400);
    }
    else {
      const targetData = target.data('tab');

      $('[data-tab]').removeClass('is-active');
      target.addClass('is-active');

      $('[data-target-tab]').removeClass('is-active');
      $(`[data-target-tab="${targetData}"]`).addClass('is-active');
    }
  }


  _makeActive() {
    $('[data-tab].is-active').find('.js-mob-description').slideDown(400);
  }

  _deactivate() {
    $('[data-tab]').find('.js-mob-description').slideUp(400);
  }

  _testScreen(point) {
    if (point.matches) {
      this._makeActive();
    }
    else {
      this._deactivate();
    }
  }
}
