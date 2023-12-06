export interface IMetaData {
    [key: string]: string
}

export interface ITimeSeriesValue {
    [key: string]: string
}

export interface ITimeSeries {
    [key: string]: ITimeSeriesValue
}

export interface ITransformTimeSeries {
    value: ITimeSeriesValue
    date: Date
    index: number
}

export interface IUsTradeOutput {
    [key: string]: ITimeSeries;
}

export interface ITransformUSTradeOutput {
    'meta_data': IMetaData;
    'time_series': ITransformTimeSeries[];
}

