
$(document).ready(function() {

  var dailySumArray = $('.bit-daily-table__cell-text.bit-sum');
  var dailySumBtcArray = $('.bit-sum-btc');
  var dailyPieChart;

  var dailySumTotal = Array.from(dailySumArray);
  var newSum = 0;

  (function() {
    $('.bit-main-data > div').velocity({ translateX: [0, -1900], opacity: [1] }, 'linear', function() {
    });
  })();

  function setSumTotal(array, sum, sumClass) {
    setTimeout(() => {
      for (var i = 0; i < array.length; i++) {
        sum += +array[i].innerHTML;
      }

      sum.toLocaleString();
      $(sumClass).html(sum.toFixed(2));
    }, 10);
  }

  var referrer =  document.referrer;

  if (referrer.indexOf('team') > 0) {
    $('.bit-contacts__action-link').removeClass('active');
    $('.bit-contacts__action-link').eq(2).addClass('active');

    $('.bit-contacts__tab').removeClass('active');
    $('.bit-contacts__tab').eq(2).addClass('active');
  }

  console.log('Previous URL is - ', referrer);

  setSumTotal(dailySumArray, newSum, '.bit-sum-total');
  setSumTotal(dailySumBtcArray, newSum, '.bit-sum-total-btc');

  function findCountChar(str, char) {
    var result = 0;
    for (var i = 0; i < str.length; i++) {

      if (str.charAt(i) === char) {
        result++;
      } else {
        continue;
      }
    }
    return result;
  }

  $('.bit-menu__item > a').on('click', function(event) {
    event.preventDefault();

    let hrefUrl = $(this).attr('href');

    $('.bit-menu__item-icon').removeClass('active');

    $(this).find('.bit-menu__item-icon').addClass('active');

    let animationContent = $('.bit-main-data > div');

    animationContent.velocity({opacity: 0.4}).velocity({ opacity: [0, 1], translateX: 1900 }, 'linear', function() {
      $(this).hide();
      window.location.replace(hrefUrl);
    });
  });

  $('.bit-copy-clipboard').on('click', function(event) {

    var clipboard = new Clipboard('.bit-copy-clipboard', {
      target: function(trigger) {
        return $(trigger).closest('.bit-data-table__cell').find('.bit-copy-target').get(0);
      }
    });

    $('.bit-copy-message').fadeIn('slow', 'jswing', function() {
      $(this).show();
    });

    setTimeout(function() {
      $('.bit-copy-message').fadeOut('slow', 'jswing', function() {
        $(this).hide();
      });
    }, 1000);
  });

  var BrowserDetect = {
    init: function() {
      this.browser = this.searchString(this.dataBrowser) || 'Other';
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
    },
    searchString: function(data) {
      for (var i = 0; i < data.length; i++) {
        var dataString = data[i].string;
        this.versionSearchString = data[i].subString;

        if (dataString.indexOf(data[i].subString) !== -1) {
          return data[i].identity;
        }
      }
    },
    searchVersion: function(dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index === -1) {
        return;
      }

      var rv = dataString.indexOf('rv:');
      if (this.versionSearchString === 'Trident' && rv !== -1) {
        return parseFloat(dataString.substring(rv + 3));
      } else {
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
      }
    },

    dataBrowser: [
      {string: navigator.userAgent, subString: 'Edge', identity: 'MS Edge'},
      {string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer'},
      {string: navigator.userAgent, subString: 'Trident', identity: 'Explorer'},
      {string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox'},
      {string: navigator.userAgent, subString: 'Opera', identity: 'Opera'},
      {string: navigator.userAgent, subString: 'OPR', identity: 'Opera'},

      {string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome'},
      {string: navigator.userAgent, subString: 'Safari', identity: 'Safari'}
    ]
  };

  BrowserDetect.init();

  if (BrowserDetect.browser === 'Safari') {
    $('body').addClass('safari');
  }
});

function formatCurrency(strCurrency) {
  let stringToNumber = parseFloat(strCurrency);
  return '$' + String(stringToNumber.toLocaleString('en-En', {minimumFractionDigits: 0, maximumFractionDigits: 0}));
}

function formatCurrencyElement(className) {
  let elements = [];

  $(className).each(function() {
    if ( isNaN(parseFloat($(this).html())) ) {
      let tempArrayOfString = $(this).html();
      elements.push($(tempArrayOfString).text());
    } else {
      elements.push($(this).html());
    }
  });

  var formattedValue = elements.map((element, i) => formatCurrency(element));

  $(className).each(function(i) {
    $(this).html(formattedValue[i]);
  });
}

function formatPercent(element) {
  let stringToNumber = parseFloat(element);
  return String(stringToNumber.toLocaleString('en-En', {minimumFractionDigits: 1, maximumFractionDigits: 1})) + '%';
}

function formatPercentElement(className) {
  var elements = [];

  $(className).each(function() {
    if ( isNaN(parseFloat($(this).html())) ) {
      let tempArrayOfString = $(this).html();
      elements.push($(tempArrayOfString).text());
    } else {
      elements.push($(this).html());
    }
  });
  // color it accordingly
  $(className).each(function(i) {
    if (elements[i] >=0) {
      color = 'green';
    } else {
      color = 'red';
    }
    $(this).css('color',color);
  });

  var formattedValue = elements.map((element, i) => formatPercent(element));

  $(className).each(function(i) {
    $(this).html(formattedValue[i]);
  });
}

function formatDateElement(className) {
  var elements = [];

  $(className).each(function() {
    elements.push($(this).html());
  });

  var formattedValue = elements.map((element, i) => formatDate(element));

  $(className).each(function(i) {
    $(this).html(formattedValue[i]);
  });
}

function formatDate(e) {
  return moment.unix(e).utc().format('YYYY-MM-DD');
}
