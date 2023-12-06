import { AlphavantageApi } from "@base/api/mock/mock.api";
import { ITransformUSTradeOutput, ITransformTimeSeries, ITimeSeries, IMetaData } from "./mock.interface";
import { MockDTO } from "./mock.dto";
import { mockParamsTransformer } from "./mock.transformer";

const api = new AlphavantageApi();



export const GetUsTradedSrv = async (payload: MockDTO) => {
    const { data } = await api.getTickerUnitedStates(mockParamsTransformer(payload));
    const dataKeys = Object.keys(data)
    let metadataIndex = '', timeSeriesDataIndex = '';

    dataKeys.forEach((r) => {
        if (r === 'Meta Data') {
            metadataIndex = r;
        } else {
            timeSeriesDataIndex = r
        }
    })

    const timeSeries = data[timeSeriesDataIndex] as unknown as ITimeSeries 
    const timeSeriesKeys = Object.keys(timeSeries);
    const result: ITransformUSTradeOutput = {
        meta_data: data[metadataIndex] as unknown as IMetaData,
        time_series: timeSeriesKeys.map((r, index)=> {
            const timeSeriesValue = timeSeries[r];
            
            return {
                value: timeSeriesValue,
                date: r,
                index: index + 1
            } as unknown as ITransformTimeSeries
        })
    };
    
    return result;
}