import { BODY } from './../_globals';

export default class Select {
  constructor(el) {
    // configuration variables
    this.element = $(el);

    // globals
    this.wrapper;
    this.placeholder;
    this.options;
    // functions
    // this.init();
  }

  init() {
    this._createDom();
    this._addEvents();
  }

  _createDom() {
    this._createParent();
    this._createArrow();
    this._createPlaceholder();
    this._createList();
  }

  _addEvents() {
    this._onFocus();
    this._onOptionClick();
    this._onClick();
  }

  _createParent() {
    this.element.hide();

    // this.arrow = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.65" d="M1 1L5 5L9 1" stroke="#B9BEC9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    let wrap = this.element.wrap('<div class="select js-select-wrapper"></div>');
    this.wrapper = wrap.parent()[0];


  }

  _createArrow() {
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('width', 10);
    arrow.setAttribute('height', 6);
    arrow.setAttribute('viewBox', '0 0 10 6');
    arrow.setAttribute('fill', 'none');
    this.wrapper.appendChild(arrow);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1 1L5 5L9 1');
    path.setAttribute('stroke', '#B9BEC9');
    path.setAttribute('stroke-width', 2);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('opacity', 0.65);
    $(this.wrapper).find('svg')[0].appendChild(path);
  }

  _createPlaceholder() {
    let placeholder;

    placeholder = document.createElement('div');
    placeholder.className = 'select__placeholder js-select-placeholder';
    placeholder.innerHTML = this.element.find('option')[0].innerHTML;

    this.wrapper.appendChild(placeholder);
    // $(this.wrapper).addClass('is-filled');
    this.placeholder = this.wrapper.querySelector('.js-select-placeholder');
  }

  _createList() {
    let options = this.element.find('option');

    let list = document.createElement('ul');
    list.className = 'select__list js-select-list';
    this.wrapper.appendChild(list);

    for (let i = 0; i < options.length; i++) {
      let li = document.createElement('li');
      li.className = 'js-select-list-item';
      li.innerHTML = options[i].innerHTML;
      list.appendChild(li);
    }

    $(list).wrap('<div class="select__dropdown js-select-dropdown">');


    this.dropdown = list.parentElement;
    this.options = list.querySelectorAll('li');
  }

  _onFocus() {
    $(this.placeholder).on('click', function(e) {
      e.stopPropagation();

      $(e.currentTarget).closest('.js-select-wrapper').toggleClass('is-active');
    });
  }

  _onOptionClick() {
    $(this.options).each(function() {
      $(this).on('click', function() {
        let value = $(this).html();
        let index = $(this).index();
        let placeholder = $(this).closest('.js-select-wrapper').find('.js-select-placeholder');

        $(placeholder).html(value);

        if ($(placeholder).html() !== '') {
          // $(this).closest('.js-select-wrapper').addClass('is-filled');
          let allOptions = $(this).closest('.js-select-wrapper').find('select option');
          let currentOption = $(this).closest('.js-select-wrapper').find('select option')[index];
          allOptions.removeAttr('selected');
          currentOption.setAttribute('selected', 'selected');
        }

      });
    });
  }

  _onClick() {
    BODY.on('click', e => {
      if ($(e.target).closest('.js-select-placeholder').length !== 0 || $(e.target).hasClass('js-select-placeholder')) return;

      $('.js-select-wrapper').removeClass('is-active');
    });
  }


}
