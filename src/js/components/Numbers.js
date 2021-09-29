export default class Numbers {
  constructor(el) {
    this.numbers = $(el);
    this.svgElement = this.numbers.find('.js-numbers-shape');
    this.svgPaths = this.svgElement.find('path');
    this.figures = this.numbers.find('.js-numbers-figure');
  }

  init() {
    this.svgPaths.on('mouseover', this._onPathOver.bind(this));
    this.figures.on('mouseover', this._onFigureOver.bind(this));
    this.svgPaths.on('mouseout', this._onPathOut.bind(this));
    this.figures.on('mouseout', this._onFigureOut.bind(this));
  }

  _onPathOver(e) {
    const t = $(e.currentTarget);
    const index = this.svgPaths.index(t);
    const gradientElement = t.prev().find('stop')[0];
    $(this.figures[index]).addClass('is-active');
    $(gradientElement).attr('stop-color', '#01C38D');
  }

  _onPathOut(e) {
    const t = $(e.currentTarget);
    const index = this.svgPaths.index(t);
    console.log(index);
    const gradientElement = t.prev().find('stop')[0];
    $(this.figures[index]).removeClass('is-active');
    $(gradientElement).attr('stop-color', '#7395BB');
  }

  _onFigureOver(e) {
    const t = $(e.currentTarget);
    const index = t.parent().index();
    const gradientElement = $(this.svgPaths[index]).prev().find('stop')[0];
    t.addClass('is-active');
    $(gradientElement).attr('stop-color', '#01C38D');
  }

  _onFigureOut(e) {
    const t = $(e.currentTarget);
    const index = t.parent().index();
    const gradientElement = $(this.svgPaths[index]).prev().find('stop')[0];
    t.removeClass('is-active');
    $(gradientElement).attr('stop-color', '#7395BB');
  }
}
