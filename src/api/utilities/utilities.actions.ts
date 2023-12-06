import SmurfResponse, { SmurfAction } from "@core/response";
import { TIME_SERIES, INTERVAL, OUTPUT_SIZE, TIME_INTRA_DAY } from "@utilities/constants";

@SmurfAction({
  action: '/utilities/time-series',
  message: 'Utilities Time Series fetched successfully',
})
export class UtilitiesTimeSeriesApi extends SmurfResponse {

  async run() {
    this.result = [...TIME_INTRA_DAY, ...TIME_SERIES];
  }
}

@SmurfAction({
  action: '/utilities/interval',
  message: 'Utilities Interval fetched successfully',
})
export class UtilitiesIntervalApi extends SmurfResponse {

  async run() {
    this.result = INTERVAL;
  }
}

@SmurfAction({
  action: '/utilities/output-size',
  message: 'Utilities Output Size fetched successfully',
})
export class UtilitiesOutputSizeApi extends SmurfResponse {

  async run() {
    this.result = OUTPUT_SIZE;
  }
}