function tableRowTemplate(element, last=false) {
  let html;
  if (last) {
    html = '<div class="bit-daily-table__footer-row SB-portfolio-row" data-name="' + element.name + '">';
  } else {
    html = '<div class="bit-daily-table__row SB-portfolio-row" data-name="' + element.name + '" >';
  }
  html += '<div class="bit-daily-table__cell">';
  html += '<span class="bit-daily-table__cell-text">' + element.name + '</span></div>';
  html += '<div class="bit-daily-table__cell">';
  html += `<span class="bit-daily-table__cell-text js-data-usd">${parseFloat(element.current_price)}</span></div>`;
  html += '<div class="bit-daily-table__cell">';
  html += `<span class="bit-daily-table__cell-text js-data-percent">${parseFloat(element.change_24h)}</span></div>`;
  html += '<div class="bit-daily-table__cell bit-mobile-hide">';
  html += `<span class="bit-daily-table__cell-text js-data-percent">${parseFloat(element.change_12m)}</span></div>`;
  html += '<div class="bit-daily-table__cell">';
  html += `<span class="bit-daily-table__cell-text js-data-percent">${parseFloat(element.change_total)}</span></div>`;
  html += '</div>';
  if (! last) {
    html += '<div class="sb-table-divider"></div>';
  }
  return html;
}

function modalHeaderTemplace() {
  let html = '<div class="SB-components-table__header-row">';
  html += '<div class="SB-components-table__header-cell-left">';
  html += '<span class="SB-components-table__header-text">Component</span>';
  html += '</div>';
  html += '<div class="SB-components-table__header-cell-right">';
  html += '<span class="SB-components-table__header-text">%age</span>';
  html += '</div>';
  html += '</div>';
  return html;
}

function modalTableRowTemplate(symbol, weight) {
  let html = '<div class="SB-components-table__header-row">';
  html += '<div class="SB-components-table-cell">';
  html += '<span class="bit-daily-table__cell-text">'+ symbol + '</span>';
  html += '</div>';
  html += '<div class="SB-components-table-cell">';
  html += '<span class="bit-daily-table__cell-text">' + weight + ' %</span>';
  html += '</div>';
  html += '</div>';
  return html;
}

function modalTemplate(portfolio) {
  let component_symbols = Object.keys(portfolio.components);
  let left_component_symbols = component_symbols.slice(0, component_symbols.length / 2);
  let right_component_symbols = component_symbols.slice(component_symbols.length / 2, component_symbols.length);
  let html = `<h2> ${window.long_names[portfolio.name]} (${portfolio.name}) </h2>`;
  html += '<div class="SB-component-table-container">';
  html += '<div class="SB-component-table-left">';
  html += modalHeaderTemplace();
  html += '<div class="sb-daily-table__content">';
  left_component_symbols.forEach(function(symbol) {
    html += modalTableRowTemplate(symbol, portfolio.components[symbol]);
  });
  html += '</div>';
  html += '</div>';
  html += '<div class="SB-component-table-right">';
  html += modalHeaderTemplace();
  html += '<div class="sb-daily-table__content">';
  right_component_symbols.forEach(function(symbol) {
    html += modalTableRowTemplate(symbol, portfolio.components[symbol]);
  });
  html += '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

function detailedStatsRowTemplate(portfolio) {
  let html = '<div class="bit-daily-table__row SB-portfolio-row">';
  html += '<div class="bit-daily-table__cell">';
  html += '<span class="bit-daily-table__cell-text">' + portfolio.index + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell bit-mobile-hide">';
  html += '<span class="bit-daily-table__cell-text js-data-dates ">' + portfolio.start_date + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell">';
  html += '<span class="bit-daily-table__cell-text js-data-percent">' + portfolio.annual_compounded_return + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell bit-mobile-hide">';
  html += '<span class="bit-daily-table__cell-text js-data-percent ">' + portfolio.annual_outperformance + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell">';
  html += '<span class="bit-daily-table__cell-text js-data-percent">' + portfolio.annualized_volatility + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell">';
  html += '<span class="bit-daily-table__cell-text">' + portfolio.sharpe_ratio + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell bit-mobile-hide">';
  html += '<span class="bit-daily-table__cell-text ">' + portfolio.sortino_ratio + '</span>';
  html += '</div>';
  html += '<div class="bit-daily-table__cell bit-mobile-hide">';
  html += '<span class="bit-daily-table__cell-text js-data-percent ">' + portfolio.max_drawdown + '</span>';
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
