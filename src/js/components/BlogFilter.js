import PubSub from 'pubsub-js';

export default class BlogFilter {
  constructor(el) {
    this.select = $(el);
    this.button = $('.js-blog-search');
    this.mainContainer = $('.js-main-article');
    this.smallContainer = $('.js-small-articles');
    this.simpleContainer = $('.js-simple-articles');
  }

  init() {
    this.button.on('click', this._getData.bind(this));
  }

  _getData(e) {
    e.preventDefault();

    const value = this.select.val();
    console.log(value);
    $.get('http://localhost:8888/articles.json', data => {
      const articles = data.articles;
      let articlesOneTag = [];
      console.log(articles);

      if (articles) {
        articles.forEach(item => {
          if (item.tag === value) {
            articlesOneTag.push(item);
          }
        });

        console.log(articlesOneTag);
        if (articlesOneTag.length !== 0) {
          articlesOneTag.forEach((item, index) => {
            if (index === 0) {
              $('.js-main-article').html('');
              $('.js-small-articles').html('');
              $('.js-simple-articles').html('');
              $('.js-main-article').append(this._mainArticleTemplate(item));
            } else if (index > 0 && index < 5) {
              $('.js-small-articles').append(this._smallArticleTemplate(item));
            } else if (index > 4) {
              $('.js-simple-articles').append(this._simpleArticleTemplate(item));
            }
          });
          articlesOneTag = [];
        } else {
          articles.forEach((item, index) => {
            if (index === 0) {
              $('.js-main-article').html('');
              $('.js-small-articles').html('');
              $('.js-simple-articles').html('');
              $('.js-main-article').append(this._mainArticleTemplate(item));
            } else if (index > 0 && index < 5) {
              $('.js-small-articles').append(this._smallArticleTemplate(item));
            } else if (index > 4) {
              $('.js-simple-articles').append(this._simpleArticleTemplate(item));
            }
          });
        }

        PubSub.publish('blogUpdate');
      }
    });
  }

  _mainArticleTemplate(item) {
    let template = item.pic ?
      `<a href="${item.url}" class="article-box article-box_main">
        <span class="article-box__wrap">
          <span class="article-box__meta">
            <span class="article-box__tag tag tag_light">${item.tag}</span>
            <span class="article-box__date">
              <span>${item.date}</span><span> - ${item.readtime}</span>
            </span>
          </span>
          <span class="article-box__text">
            <h4>${item.title}</h4>
            <p>${item.brief}</p>
          </span>
        </span>
        <span class="article-box__pic">
          <img src="${item.pic}" alt="" />
        </span>
      </a>` :
      `<a href="${item.url}" class="article-box article-box_main">
        <span class="article-box__wrap">
          <span class="article-box__meta">
            <span class="article-box__tag tag tag_light">${item.tag}</span>
            <span class="article-box__date">
              <span>${item.date}</span><span> - ${item.readtime}</span>
            </span>
          </span>
          <span class="article-box__text">
            <h4>${item.title}</h4>
            <p>${item.brief}</p>
          </span>
        </span>
        <span class="article-box__pic"></span>
      </a>`;

    return template;
  }

  _smallArticleTemplate(item) {
    let template = `<a href="${item.url}" class="article-box article-box_small">
      <span class="article-box__wrap">
        <span class="article-box__meta">
          <span class="article-box__tag tag">${item.tag}</span>
          <span class="article-box__date">
            <span>${item.date}</span><span> - ${item.readtime}</span>
          </span>
        </span>
        <span class="article-box__text">
          <h4>${item.title}</h4>
        </span>
      </span>
    </a>`;

    return template;
  }

  _simpleArticleTemplate(item) {
    let template = item.pic ?
      `<a href="${item.url}" class="article-box">
        <span class="article-box__wrap">
          <span class="article-box__meta">
            <span class="article-box__tag tag">${item.tag}</span>
            <span class="article-box__date">
              <span>${item.date}</span>
              <span> - ${item.readtime}</span>
            </span>
          </span>
          <span class="article-box__text">
            <h4>${item.title}</h4>
            <p>${item.brief}</p>
          </span>
        </span>
        <span class="article-box__pic">
          <img src="${item.pic}" alt="" />
        </span>
      </a>` :
      `<a href="${item.url}" class="article-box">
        <span class="article-box__wrap">
          <span class="article-box__meta">
            <span class="article-box__tag tag">${item.tag}</span>
            <span class="article-box__date">
              <span>${item.date}</span>
              <span> - ${item.readtime}</span>
            </span>
          </span>
          <span class="article-box__text">
            <h4>${item.title}</h4>
            <p>${item.brief}</p>
          </span>
        </span>
      </a>`;

    return template;
  }

}
