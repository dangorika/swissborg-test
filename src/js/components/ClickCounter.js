export default class ClickCounter {
  constructor(el) {
    this.counter = $(el);
    this.btn = this.counter.find('.js-click-counter-btn');
    this.text = this.counter.find('.js-click-counter-text');
    this.count = +this.text.val();
    this.isLiked = false;
  }

  init() {
    console.log(this.counter);
    this.counter.on('submit', e => {
      e.preventDefault();
      const target = $(e.target);
      if (!this.isLiked) {
        this.count++;
        this.isLiked = true;
      } else {
        this.count--;
        this.isLiked = false;
      }
      // const text = $(e.target).closest(this.counter).find('.js-click-counter-text').val(this.count);
      // $.post(this.counter.attr('action'), {likes: this.count});
      $.ajax({
        url : this.counter.attr('action'),
        type: 'post',
        data: {likes: this.count},
        success: function(data) {
          console.log(data.likes);
          target.closest(this.counter).find('.js-click-counter-text').val(data.likes);
        }
      });
    });
  }
}
