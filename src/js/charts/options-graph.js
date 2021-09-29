import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

import moment from './moment';

import { BREAKPOINTS } from './../_globals';

export default () => {

  if ($('.js-charts').length === 0) return;

  var windowWidth = $(window).width();
  var color1, url, html, last, domElement, str, pieColors, components, dailyPieChart, suffix, description, symbol, component_name, filter_callback, y, x, buttons, buttons_obj, optionsGraphSpline, historySplineChart, color, portfolio;
  var historySplineChart1;


  function testTablet(point) {
    if (point.matches) {
      dailyPieChart.setSize(286, 348);
    } else {
      dailyPieChart.setSize(456, 506);
    }
  }

  // function testTabletHistory(point) {
  //   if (point.matches) {
  //     historySplineChart.redraw();
  //     // historySplineChart = new Highcharts.stockChart('container', optionsGraphSpline);
  //     // historySplineChart1 = historySplineChart;
  //   } else {
  //     historySplineChart.redraw();
  //     // historySplineChart = new Highcharts.stockChart('container', optionsGraphSpline);
  //     // historySplineChart1 = historySplineChart;
  //   }
  // }

  function filtering_closure_generator(key, value) {
  /*
      this function returns a filtering callback function which carries its own closure variables of key and value
    */
    return function(element) {
      if (element[key] === value) {
        return value;
      }
    };
  }

  function displayHistoricalChart(names) {
    var seriesData = [];
    var json_files_received = 0;
    if (names.length > 1 && names[1].slice(0,2) === 'SB') { // SWISSBORG BRANDED INDEX
      color1 = '#91C965';
    } else {
      color1 = '#A4C3C8';
    }
    var colors = ['#2D95FF', '#01C38D'];
    $.each(names, function(i, name) {
      url = name + '.json';
      $.getJSON(url, function(data) {
        filter_callback = filtering_closure_generator('name', name);
        y = window.latest_data['portfolios'].filter(filter_callback)[0]['current_price'];
        x = window.latest_data['last_updated_at'];
        data.push([x*1000, parseFloat(y)]);
        seriesData.push({
          name: name,
          data: data,
          color: colors[i]
        });
        json_files_received = json_files_received + 1;
        if (json_files_received === names.length) {
        // all jsons are received, we can create the chart now.
          displayDataGraph(seriesData);
          formatCurrencyElement('series-tooltip-usd');
        }
      });
    });
  }

  function displayPieChart(data, total, name) {

    let optionsPie = {
      chart: {
        renderTo: 'portfolioPieChart',
        backgroundColor: 'transparent',
        type: 'pie',
        width: 456,
        height: 506
      },
      title: {
        text: '<h4 id="pie-header" class="pie__title">' + window.long_names[name] + ' </h4>',
        align: 'left',
        style: {
          color: '#191E29'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          dataLabels: {
            enabled: false,
          },
          states: {
            hover: {
              color: '#01C38D',
              lineWidth: 4,
            }
          },
          borderWidth: 0,
          center: ['50%', '50%']
        }
      },
      tooltip: {
        formatter: function() {
          return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
        }
      },
      series: [{
        name: 'Tokens',
        data: data,
        startAngle: -90,
        size: '100%',
        innerSize: '43%',
        lineWidth: 0,
      }],
      exporting: {
        enabled: false
      }
    };

    dailyPieChart = new Highcharts.Chart(optionsPie);

    testTablet(BREAKPOINTS.mobile);
    BREAKPOINTS.mobile.addListener(testTablet);

  // setPositionSVGTitle();
  }

  // function setPositionSVGTitle() {
  //   $('.graph-btc').attr('dy', '5');
  //   $('.sb-pie-header').attr('dy', '0');
  // }

  function displayDataGraph(seriesData) {

    buttons = window.buttons_data.buttons.contextButton.menuItems;

    buttons_obj = window.buttons_data.menuItemDefinitions;
    // buttons_obj.showBtc = {"text": "Compare with BTC", "textKey": "showBtc", "onclick": function() {console.log("fa")}}
    // buttons_obj.showEth = {"text": "Compare with ETH", "textKey": "showBtc", "onclick": function() {console.log("fa")}}
    // buttons_obj.showXrp = {"text": "Compare with XRP", "textKey": "showBtc", "onclick": function() {console.log("fa")}}
    // buttons_obj.showLtc = {"text": "Compare with LTC", "textKey": "showBtc", "onclick": function() {console.log("fa")}}

    // buttons.push("separator")
    // buttons.push("showBtc")
    // buttons.push("showEth")
    // buttons.push("showXrp")
    // buttons.push("showLtc")

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.rectHandle = (x,y,w,h) => {
      return [
      // right arrow
        'M', x - w / 2, y + 3,
        'L', x - w / 2, y + h - 3,
        'C', x - w / 2, y + h, w, y + h, w, y + h - 3,
        'L', w, y + 3,
        'C', w, y, x - w / 2, y, x - w / 2, y + 3,
        'Z',
      ];
    };
    Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
      return [
      // Arrow stem
        'M', x+15, y+8,
        'A', 4, 4, 0, 0, 0, x+15, y+8,
        'Z',
        // Arrow stem
        'M', x+15, y+15,
        'A', 4, 4, 0, 0, 0, x+15, y+15,
        'Z',
        // Arrow stem
        'M', x+15, y+22,
        'A', 4, 4, 0, 0, 0, x+15, y+22,
        'Z'
      ];
    };

    // Override the legend symbol creator function
    Highcharts.wrap(Highcharts.Series.prototype, 'drawLegendSymbol', function(proceed, legend) {
      proceed.call(this, legend);

      this.legendLine.attr({
        d: ['M',-10,8.13278,'L',-9.66669,8.22856,'L',-6.33338, 6.75144,'L',-3.00002,8.11656,'L',-1.6667,11,'L',2.3333,7.1672,'L',5,7.42971,'L',7.6667,6,'L',10.3333,7.21194,'L',13,8.1669],
        'stroke-width': 1
      })
        .add(this.legendGroup);
    });

    optionsGraphSpline = {
      exporting: {
        buttons: {
          contextButton: {
            theme: {
              fill: '#01C38D',
              r: 8
            },
            menuItems: buttons,
            symbol: 'download',
            symbolFill: '#FFFFFF',
            symbolStroke: '#FFFFFF',
            symbolSize: 24,
            symbolX: 20,
            symbolY: 22,
            width: 46,
            height: 46,
            y: -10,
            x: 0
          }
        },
        menuItemDefinitions: buttons_obj
      },
      chart: {
        zoomType: 'x',
        style: {
          fontFamily: '\'TT Commons Regular\', Arial, Helvetica, sans-serif',
          fontSize: '18px'
        },
        events: {
          redraw: chart => {
            $('.highcharts-label-box').attr('rx', 8).attr('ry', 8).attr('y', -9);
            if (BREAKPOINTS.tablet.matches) {
              $('.highcharts-range-selector-buttons').attr('transform', 'translate(-4,12)');
              $('.highcharts-input-group').attr('transform', 'translate(0,66)');
            }
          }
        }
      },
      scrollbar: {
        enabled: false
      },
      legend: {
        enabled: true,
        y: -14,
        x: -15,
        verticalAlign: 'top',
        itemDistance: 48,
        itemStyle: {
          fontSize: 18,
          fontWeight: 400,
          color: '#666666'
        },
        labelFormat: '{name}'
      },
      navigator: {
        maskFill: 'rgba(185,190,201,.6)',
        height: 56,
        outlineColor: 'rgba(185,190,201,.6)',
        handles: {
          symbols: ['rectHandle', 'rectHandle'],
          width: 3,
          backgroundColor: '#FFFFFF',
          borderColor: '#B9BEC9',
          height: 28,
        }
      },
      rangeSelector: {
        allButtonsEnabled: true,
        selected: 4,
        inputBoxBorderColor: '#B9BEC9',
        inputBoxHeight: 41,
        inputBoxWidth: 108,
        // inputBoxRadius: 8,
        inputDateFormat: '%Y-%m-%d',
        inputStyle: {
          color: '#696E79'
        },
        inputPosition: {
          x: -54
        },
        buttonPosition: {
          y: 2
        },
        buttonTheme: {
          fill: 'none',
          stroke: 'none',
          buttonSpacing: 0,
          r: 8,
          padding: 10,
          width: 28,
          height: 26,
          y: -12,
          style: {
            color: '#696E79',
          },
          states: {
            hover: {
              fill: 'transparent',
              style: {
                color: '#191E29'
              }
            },
            select: {
              fill: '#01C38D',
              style: {
                color: '#FFFFFF',
                fontWeight: 'normal'
              }
            }
          }
        },
      },
      yAxis: {
        labels: {
          formatter: function() {
            return (this.value > 0 ? ' ' : ' - ') + formatCurrency(Math.abs(this.value)) + ' %';
          }
        },
        gridLineWidth: 1,
        gridLineColor: '#EDEFF1',
        plotLines: [{
          value: 1,
          width: 2,
          color: '#B9BEC9'
        }]
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },
      tooltip: {
        pointFormat: '<span class="series-tooltip-usd" style="color:{series.color};">{point.y}</span><br/>',
        headerFormat: '<span>{point.key}</span><br/>',
        valueDecimals: 2,
        split: true,
        // xDateFormat: '%Y-%b-%d',
        valuePrefix: '$',
        backgroundColor: 'rgba(185,190,201,.6)',
        borderWidth: 0,
        shadow: false,
        borderRadius: 8,
        padding: 10,
        style: {
          color: '#FFFFFF',
          fontSize: '18px',
          backgroundColor: ''
        }
      },
      series: seriesData,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 767
            },
            chartOptions: {
              rangeSelector: {
                inputBoxWidth: 90,
                buttonTheme: {
                  width: 22
                }
              },
              exporting: {
                buttons: {
                  contextButton: {
                    width: 42,
                    y: 46,
                    x: 4
                  }
                }
              }
            }
          },
          {
            condition: {
              maxWidth: 1023
            },
            chartOptions: {
              legend: {
                enabled: true,
                verticalAlign: 'bottom',
                align: 'left',
                y: 0,
                x: 0
              },
              rangeSelector: {
                inputPosition: {
                  align: 'left',
                  x: -8
                },
                buttonPosition: {
                  x: -4
                },
              }
            }
          }

        ]
      }
    };
    historySplineChart = new Highcharts.stockChart('container', optionsGraphSpline);

    // testTabletHistory(BREAKPOINTS.mobile);
    // BREAKPOINTS.mobile.addListener(testTabletHistory);

    $('.highcharts-label-box').attr('rx', 8).attr('ry', 8).attr('y', -9);
  }

  function displaySBPorfolioPieChart(portfolio) {
    pieColors = ['#13A87E', '#108F6B', '#0D7558'];
    components = portfolio.components;
    var pie_chart_input = [];
    for (var key in components) {
      if (pieColors.length === 0) {
        var color = '#108F6B';
      } else {
        var color = pieColors.pop();

      }
      var data = {'name': key, 'y':components[key], 'color': color};
      pie_chart_input.push(data);

    }
    displayPieChart(pie_chart_input, 100, portfolio.name);
  }


  function tableRowTemplate(element) {
    let html = '<div class="chart-table__tr js-chart-table-row" data-name="' + element.name + '" >';
    html += '<div class="chart-table__td">';
    html += '<span>' + element.name + '</span></div>';
    html += '<div class="chart-table__td">';
    html += `<span class="js-data-usd">${parseFloat(element.current_price)}</span></div>`;
    html += '<div class="chart-table__td">';
    html += `<span class="js-data-percent">${parseFloat(element.change_24h)}</span></div>`;
    html += '<div class="chart-table__td">';
    html += `<span class="js-data-percent">${parseFloat(element.change_12m)}</span></div>`;
    html += '<div class="chart-table__td">';
    html += `<span class="js-data-percent">${parseFloat(element.change_total)}</span></div>`;
    html += '</div>';
    return html;
  }

  function componentHeaderTemplate() {
    let html = '<div class="chart-component-table__head">';
    html += '<div class="chart-component-table__th">Component</div>';
    html += '<div class="chart-component-table__th">%age</div>';
    html += '</div>';
    return html;
  }

  function componentTableRowTemplate(symbol, weight) {
    let html = '<div class="chart-component-table__tr">';
    html += '<div class="chart-component-table__td">'+ symbol +'</div>';
    html += '<div class="chart-component-table__td">'+ weight +' %</div>';
    html += '</div>';
    return html;
  }

  function componentTemplate(portfolio) {
    let component_symbols = Object.keys(portfolio.components);
    let left_component_symbols = component_symbols.slice(0, component_symbols.length / 2);
    let right_component_symbols = component_symbols.slice(component_symbols.length / 2, component_symbols.length);
    let html = '<div class="chart-component__in">';
    html += '<div class="chart-component-table">';
    html += componentHeaderTemplate();
    html += '<div class="chart-component-table__body">';
    left_component_symbols.forEach(function(symbol) {
      html += componentTableRowTemplate(symbol, portfolio.components[symbol]);
    });
    html += '</div>';
    html += '</div>';
    html += '<div class="chart-component-table">';
    html += componentHeaderTemplate();
    html += '<div class="chart-component-table__body">';
    right_component_symbols.forEach(function(symbol) {
      html += componentTableRowTemplate(symbol, portfolio.components[symbol]);
    });
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function detailedStatsRowTemplate(portfolio) {
    let html = '<div class="chart-detail-table__tr">';
    html += '<div class="chart-detail-table__td">';
    html += '<span>'+portfolio.index+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span class="js-data-dates">'+portfolio.start_date+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span class="js-data-percent">'+portfolio.annual_compounded_return+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span class="js-data-percent ">'+portfolio.annual_outperformance+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span class="js-data-percent">'+portfolio.annualized_volatility+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span>'+portfolio.sharpe_ratio+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span>'+portfolio.sortino_ratio+'</span>';
    html += '</div>';
    html += '<div class="chart-detail-table__td">';
    html += '<span class="js-data-percent">'+portfolio.max_drawdown+'</span>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function detailedStatsTableTemplate(portfolios) {
    let html = '';
    portfolios.forEach(function(portfolio) {
      html += detailedStatsRowTemplate(portfolio);
      if (portfolio.index !== 'BTC') {
        html += '<div class="sb-table-divider"></div>';
      }
    });
    return html;
  }


  $(document).ready(function() {

    var dailySumArray = $('.bit-daily-table__cell-text.bit-sum');
    var dailySumBtcArray = $('.bit-sum-btc');
    var dailyPieChart;

    var dailySumTotal = Array.from(dailySumArray);
    var newSum = 0;

    // (function() {
    //   $('.bit-main-data > div').velocity({ translateX: [0, -1900], opacity: [1] }, 'linear', function() {
    //   });
    // })();

    // let tl = new TimelineLite();

    // tl
    //   .fromTo('.bit-main-data > div', 0.4, {opacity: 0, x: -9999}, {opacity: 1, x: 0});

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

    // $('.bit-menu__item > a').on('click', function(event) {
    //   event.preventDefault();

    //   let hrefUrl = $(this).attr('href');

    //   $('.bit-menu__item-icon').removeClass('active');

    //   $(this).find('.bit-menu__item-icon').addClass('active');

    //   let animationContent = $('.bit-main-data > div');

    //   // let tl = new TimelineLite({
    //   //   onComplete: () => {
    //   //     $(this).hide();
    //   //     window.location.replace(hrefUrl);
    //   //   }
    //   // });

    //   // tl
    //   //   .fromTo(animationContent, 0.4, {opacity: 0, x: -9999}, {opacity: 1, x: 0});

    //   // animationContent.velocity({opacity: 0.4}).velocity({ opacity: [0, 1], translateX: 1900 }, 'linear', function() {
    //   //   $(this).hide();
    //   //   window.location.replace(hrefUrl);
    //   // });
    // });

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



  $(document).ready(function() {

    var windowHeight = $(window).height();

    var currentDate = new Date();
    var lastDate = moment().format('MM-DD-YY');
    var formattedLastDate = moment().add(-1, 'days').format('MM/DD/YY');


    moment.locale('en');
    var scrollPosition = 500;
    window.long_names = {
      'SB20': 'SwissBorg 20',
      'BTC': 'Bitcoin',
      'TOP20': 'Top20 Crypto',
      'SB-NEXT30': 'SwissBorg Next30'
    };

    window.buttons_data = Highcharts.getOptions().exporting;
    window.details = false;

    // $(window).resize(function() {
    //   let containerWidth = $('.bit-data-graph').width();
    //   let containerHeight = $('.bit-data-graph').height();
    //   historySplineChart.setSize(containerWidth, containerHeight, true);
    // });

    var lim = 10;
    var off = 40;

    function constructAllComponents(portfolios) {
      var fullHtml = '';
      portfolios.forEach(function(portfolio) {
        html = componentTemplate(portfolio);;
        component_name = portfolio.name;
        fullHtml = fullHtml + '<div data-target="'+ component_name + '" class="chart-component js-chart-component">' + html + '</div>';
      });
      $('.js-chart-components').html(fullHtml);
      $($('.js-chart-component')[0]).addClass('is-active');
    }

    function displayLatestTable(result) {
      html = '';
      for (var i = 0; i < result.length; i++) {
        last = (i === result.length-1); // if the element is last
        html += tableRowTemplate(result[i], last);
      }
      domElement = $('#SB-indices-list');
      domElement.html(html);
    }

    function displayLastUpdated(unix_timestamp) {
      str = moment.unix(unix_timestamp).fromNow();
      domElement = $('#SB-last-updated-at');
      domElement.html('Last Updated: ' + str);
    }


    function formatSelectedTableRow(portfolio_name) {
      $('.js-chart-table-row').each(function() {
        if (this.dataset.name === portfolio_name) {
          $(this).addClass('is-bold');
        } else {
          $(this).removeClass('is-bold');
        }
      });
    }

    // function displaySBPorfolioDescription(portfolio) {
    //   if (portfolio.name === 'BTC') {
    //     suffix = '';
    //   } else {
    //     suffix = '<a href="#SBcomponentmodal'+ portfolio.name + '" rel="modal:open"><span class="SB-index-components"> <i class=" fas fa-plus-circle fa-lg" data="' + portfolio.name + '"></i>  More Details</span></a>';
    //   }
    //   description = '<p class="SB-description-content">' + portfolio.description + '</p>' + suffix;
    //   $('#SB-bucket-description').html(description);
    // }

    function displaySBPorfolioComponents(portfolio_name) {
      $('.js-chart-component').removeClass('is-active');
      $(`.js-chart-component[data-target=${[portfolio_name]}]`).addClass('is-active');
    }

    function switchPortfolioTo(portfolio_name) {
      if (portfolio_name === 'BTC') {
        displayHistoricalChart(['BTC']);
      } else {
        displayHistoricalChart(['BTC', portfolio_name]);
      }
      formatSelectedTableRow(portfolio_name);
      fetchLatestData(function(result) {
        for (portfolio of result.portfolios) {
          if (portfolio.name === portfolio_name) {
            displaySBPorfolioPieChart(portfolio);
            // displaySBPorfolioDescription(portfolio);
            displaySBPorfolioComponents(portfolio.name);
          }
        }
      });

      console.log(portfolio_name);
    }

    function setupPortfolioSwitcher() {
      $('.js-chart-table-row').click(function() {
        switchPortfolioTo(this.dataset.name);
      });

    }

    function fetchLatestData(callback) {
      $.ajax({
        url: 'latest.json',
        type: 'GET',
        success: function(result) {
          window.latest_data = result;
          callback(result);
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.log('Error parsing latest json');
        }
      });
    }

    function fetchDetailedStats(callback) {
      let url = 'detailed_stats.json';
      $.getJSON(url, function(data) {
        callback(data);
      });
    }

    function displayDetailedStatsTable(data) {
      let html = detailedStatsTableTemplate(data.portfolios);
      $('#SB-indices-detailed-stats').html(html);
      setTimeout(formatter, 100);
    }

    fetchLatestData(function(result) {
      displayHistoricalChart(['BTC', 'SB20']);
      displayLatestTable(result.portfolios);
      displayLastUpdated(result.last_updated_at);
      displaySBPorfolioPieChart(result.portfolios[0]); // display pie chart for first portfolio
      // displaySBPorfolioDescription(result.portfolios[0]);
      formatSelectedTableRow(result.portfolios[0].name);
      setupPortfolioSwitcher();
      constructAllComponents(result.portfolios);
      fetchDetailedStats(displayDetailedStatsTable);
    });

  });

  function screenLimiter() {
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
  }

  screenLimiter();

  $('.js-chart-details').click(e => {
    e.preventDefault();
    const target = $(e.currentTarget);
    if (window.details) {
      window.details = false;
      $('.js-chart-detail').removeClass('is-active');
      $('.js-chart-brief').addClass('is-active');
      target.text(target.data('start-text'));
    } else {
      window.details = true;
      $('.js-chart-brief').removeClass('is-active');
      $('.js-chart-detail').addClass('is-active');
      target.text(target.data('end-text'));
    }
  });

  function formatter() {
    formatCurrencyElement('.js-data-usd');
    formatPercentElement('.js-data-percent');
    formatDateElement('.js-data-dates');

  }

};
