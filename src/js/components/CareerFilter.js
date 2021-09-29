export default class CareerFilter {
  constructor(props) {
    this.tagSelect = $(props.tagSelect);
    this.locationSelect = $(props.locationSelect);
    this.tagOptions = this.tagSelect.closest('.js-select-wrapper').find('li');
    this.locationOptions = this.locationSelect.closest('.js-select-wrapper').find('li');
    this.tagValue = this.tagSelect.find('option:selected').val();
    this.locationValue = this.locationSelect.find('option:selected').val();

    this.resultBoxes = $('[data-tag]');
    this.resultItems = $('[data-location]');
  }

  init() {
    this.tagOptions.on('click', this._onTagChange.bind(this));
    this.locationOptions.on('click', this._onLocationChange.bind(this));
  }

  _onTagChange(e) {
    const target = this.tagSelect.find('option:selected');
    this.tagValue = target.val();
    this._filterBoxes(this.tagValue);
  }

  _onLocationChange(e) {
    const target = this.locationSelect.find('option:selected');
    this.locationValue = target.val();
    this._filterLocations(this.locationValue);
  }

  _filterBoxes(value) {
    this.resultBoxes.hide();
    $(`[data-tag="${value}"]`).show();
    if (value === 'all_tags') this.resultBoxes.show();
  }

  _filterLocations(value) {
    this.resultItems.hide();
    $(`[data-location="${value}"]`).show();
    if (value === 'all_locations') this.resultItems.show();
  }
}
