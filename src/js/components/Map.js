export default class Map {
  constructor(map) {
    this.map = $(map);
    this.mapPin = this.map.find('circle');
    this.pin = this.map.find('.pin');
  }

  init() {
    this.mapPin.on('mouseover', this._onMapPinOver.bind(this));
    this.pin.on('mouseover', this._onPinOver.bind(this));
    this.mapPin.on('mouseout', this._onMapPinOut.bind(this));
    this.pin.on('mouseout', this._onPinOut.bind(this));
  }

  _onMapPinOver(e) {
    const t = $(e.currentTarget);
    console.log(t);

    $('[data-pin]').removeClass('is-active');
    t.addClass('is-active');

    $('[data-pin-text]').removeClass('is-active');
    $(`[data-pin-text=${t.data('pin')}]`).addClass('is-active');
    // const index = this.svgPaths.index(t);
    // const gradientElement = t.prev().find('stop')[0];
    // $(this.figures[index]).addClass('is-active');
    // $(gradientElement).attr('stop-color', '#01C38D');
  }

  _onMapPinOut(e) {
    const t = $(e.currentTarget);
    $('[data-pin]').removeClass('is-active');
    $('[data-pin-text]').removeClass('is-active');
    // const index = this.svgPaths.index(t);
    // console.log(index);
    // const gradientElement = t.prev().find('stop')[0];
    // $(this.figures[index]).removeClass('is-active');
    // $(gradientElement).attr('stop-color', '#7395BB');
  }

  _onPinOver(e) {
    const t = $(e.currentTarget);
    console.log(t);

    $('[data-pin-text]').removeClass('is-active');
    t.addClass('is-active');

    $('[data-pin]').removeClass('is-active');
    $(`[data-pin=${t.data('pin-text')}]`).addClass('is-active');
    // const index = t.parent().index();
    // const gradientElement = $(this.svgPaths[index]).prev().find('stop')[0];
    // t.addClass('is-active');
    // $(gradientElement).attr('stop-color', '#01C38D');
  }

  _onPinOut(e) {
    const t = $(e.currentTarget);
    $('[data-pin]').removeClass('is-active');
    $('[data-pin-text]').removeClass('is-active');
    // const index = t.parent().index();
    // const gradientElement = $(this.svgPaths[index]).prev().find('stop')[0];
    // t.removeClass('is-active');
    // $(gradientElement).attr('stop-color', '#7395BB');
  }
}
