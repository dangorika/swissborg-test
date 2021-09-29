import { BODY, CLASSES, WIN, HTMLBODY } from './../_globals';

let SCROLL_TOP_MODAL = 0;

export default class Modal {
  constructor(el) {
    this.modal = $('[data-target-modal]');
    this.button = $(el);
    this.close = this.modal.find('.js-modal-close');
    this.src = this.button.data('src');
  }

  init() {
    this.button.on('click', this._open.bind(this));
    this.close.on('click', this._close.bind(this));
  }

  _open(e) {
    this.targetModal = $(e.currentTarget).data('modal');
    console.log(this.targetModal);
    $(`[data-target-modal="${this.targetModal}"]`).addClass(CLASSES.active);
    SCROLL_TOP_MODAL = WIN.scrollTop();
    BODY.animate({top: -SCROLL_TOP_MODAL},0);
    BODY.addClass(CLASSES.modalOpen);


    this.video = $(`[data-target-modal="${this.targetModal}"]`).find('.modal__video');

    this.video.html(`<iframe src="${this.src}"
    frameborder="0" allow="accelerometer;" allowfullscreen></iframe>`);
  }

  _close(e) {
    this.openedModal = $(e.currentTarget).closest('[data-target-modal]');
    this.openedModal.removeClass(CLASSES.active);
    BODY.removeClass(CLASSES.modalOpen);
    BODY.removeAttr('style');
    HTMLBODY.animate({scrollTop: SCROLL_TOP_MODAL},0);
  }
}
