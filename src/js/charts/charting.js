var widthPieChart = $('#portfolioPieChart').width() - 50;
var windowWidth = $(window).width();

if (windowWidth < 600) {
  widthPieChart = 250;
}

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
  var colors = ['#000', color1];
  $.each(names, function(i, name) {
    url = 'https://indices.swissborg.com/historical/' + name + '.json';
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
      width: widthPieChart,
      height: 350,
      spacingBottom: 10,
      spacingTop: 10,
      spacingLeft: 10,
      spacingRight: 10
    },
    title: {
      text: '<span id="pie-header" class="sb-pie-header">' + window.long_names[name] + ' </span>',
      floating: true,
      style: {
        // 0E4059
        color: '#82C341'
      },
      y: 35
    },

    yAxis: {
      title: {
        text: 'Component Percentage'
      },
      labels: {
        rotation: 'auto'
      }
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        showInLegend: false,
        dataLabels: {
          distance: 10,
          color: '#6D96A2',

          style: {
            textOutline: '0',
            color: '#6D96A2',
          },

          formatter: function() {
            if (this.point.y > 4.7) {
              return this.point.name;
            }
          }

        },
        center: ['50%', '55%']
      },
      series: {
        shadow:{
          width:6
        },
        dataLabels: {
          crop: false,
          overflow: 'none'
        }
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
      showInLegend: true,
      connectorColor: 'black',
      dataLabels: {
        enabled: true,
        color: '#6D96A2',
        style: {
          fontWeight: '0',
          textOutline: '0'
        },
        label: {
          minFontSize: '0'
        }
      }
    }]
  };

  if (windowWidth < 620) {
    optionsPie.plotOptions.pie.dataLabels.distance = 5;
  }

  dailyPieChart = new Highcharts.Chart(optionsPie);
  setPositionSVGTitle();
}

function setPositionSVGTitle() {
  $('.graph-btc').attr('dy', '5');
  $('.sb-pie-header').attr('dy', '0');
}

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

  optionsGraphSpline = {
    exporting: {
      buttons: {
        contextButton: {
          menuItems: buttons
        }
      },
      menuItemDefinitions: buttons_obj
    },
    chart: {
      zoomType: 'x',
    },

    rangeSelector: {
      allButtonsEnabled: true,
      selected: 4
    },

    yAxis: {
      labels: {
        formatter: function() {
          return (this.value > 0 ? ' ' : ' - ') + formatCurrency(Math.abs(this.value)) + ' %';
        }
      },
      gridLineWidth:0,
      plotLines: [{
        value: 0,
        width: 2,
        color: 'silver'
      }]
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <span class="series-tooltip-usd"><b>{point.y}</b></span><br/>',
      valueDecimals: 2,
      split: true,
      xDateFormat: '%Y-%b-%d',
      valuePrefix: '$'
    },

    series: seriesData
  };
  historySplineChart = new Highcharts.stockChart('container', optionsGraphSpline);

}

function displaySBPorfolioPieChart(portfolio) {
  pieColors = ['#DEFDC0', '#C4F792', '#9CD862','#90CA60','#84C14A'];
  components = portfolio.components;
  var pie_chart_input = [];
  for (var key in components) {
    if (pieColors.length === 0) {
      var color = '#C4F792';
    } else {
      var color = pieColors.pop();

    }
    var data = {'name': key, 'y':components[key], 'color': color};
    pie_chart_input.push(data);

  }
  displayPieChart(pie_chart_input, 100, portfolio.name);
}
